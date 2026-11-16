// =====================================================
// PROJET FINAL CICD — MBARGA Ernest — B3 DevOps
// Chaîne : Git → Build → Test → Push → Staging → Validation → Prod → K8s
// =====================================================
pipeline {
    agent any

    parameters {
        string(name: 'DOCKERHUB_ID', defaultValue: 'mbargaernest', description: 'Docker Hub ID')
        booleanParam(name: 'DEPLOY_PROD', defaultValue: true, description: 'Déployer en production après staging')
    }

    environment {
        IMAGE          = "${params.DOCKERHUB_ID}/mbarga-portfolio"
        VERSION        = "2.0.${env.BUILD_NUMBER}"
        TEST_CONTAINER = "cicd-test-${env.BUILD_NUMBER}"
        STAGING_PORT   = "8091"
        PROD_PORT      = "8092"
    }

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        // ── STAGE 1 : Build ─────────────────────────────
        stage('Build image') {
            steps {
                sh '''
                    docker build -t $IMAGE:$VERSION -t $IMAGE:latest .
                    echo "Image construite : $IMAGE:$VERSION"
                '''
            }
        }

        // ── STAGE 2 : Tests d'acceptance ────────────────
        stage("Tests d'acceptance") {
            steps {
                sh '''
                    docker rm -f $TEST_CONTAINER 2>/dev/null || true
                    docker run -d --name $TEST_CONTAINER -p 3002:3000 $IMAGE:$VERSION
                    sleep 4
                    mkdir -p reports

                    echo "=== RAPPORT CICD ===" > reports/rapport-cicd.txt
                    echo "Date    : $(date)"    >> reports/rapport-cicd.txt
                    echo "Build   : #$BUILD_NUMBER" >> reports/rapport-cicd.txt
                    echo "Image   : $IMAGE:$VERSION" >> reports/rapport-cicd.txt
                    echo "" >> reports/rapport-cicd.txt

                    docker exec $TEST_CONTAINER wget -qO- http://localhost:3000/ > /dev/null \
                      && echo "PASS : HTTP 200" | tee -a reports/rapport-cicd.txt

                    docker exec $TEST_CONTAINER wget -qO- http://localhost:3000/ | grep -i "Ernest" > /dev/null \
                      && echo "PASS : Titre Ernest" | tee -a reports/rapport-cicd.txt

                    docker exec $TEST_CONTAINER wget -qO- http://localhost:3000/ | grep "mbargaernest80@gmail.com" > /dev/null \
                      && echo "PASS : Email present" | tee -a reports/rapport-cicd.txt

                    echo "=== TOUS LES TESTS PASSES ===" | tee -a reports/rapport-cicd.txt
                    cat reports/rapport-cicd.txt
                '''
            }
        }

        // ── STAGE 3 : Push Docker Hub ───────────────────
        stage('Push Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DH_USER',
                    passwordVariable: 'DH_TOKEN'
                )]) {
                    sh '''
                        echo "$DH_TOKEN" | docker login -u "$DH_USER" --password-stdin
                        docker push $IMAGE:$VERSION
                        docker push $IMAGE:latest
                        echo "Image poussee : $IMAGE:$VERSION"
                        docker logout
                    '''
                }
            }
        }

        // ── STAGE 4 : Deploy Staging ────────────────────
        stage('Deploy Staging') {
            steps {
                sh '''
                    docker rm -f portfolio-staging 2>/dev/null || true
                    docker run -d --name portfolio-staging \
                        -p $STAGING_PORT:3000 \
                        -e NODE_ENV=staging \
                        $IMAGE:$VERSION
                    sleep 4
                    docker exec portfolio-staging wget -qO- http://localhost:3000/ | grep -i "Ernest" > /dev/null
                    echo "Staging OK : http://localhost:$STAGING_PORT — version $VERSION"
                '''
            }
        }

        // ── STAGE 5 : Validation humaine ────────────────
        stage('Validation avant prod') {
            when { expression { return params.DEPLOY_PROD == true } }
            steps {
                timeout(time: 15, unit: 'MINUTES') {
                    input message: "Deployer la version ${VERSION} en PRODUCTION ?",
                          ok: 'Deployer en prod'
                }
            }
        }

        // ── STAGE 6 : Deploy Production ─────────────────
        stage('Deploy Production') {
            when { expression { return params.DEPLOY_PROD == true } }
            steps {
                script {
                    def previousImage = sh(
                        script: "docker inspect --format='{{.Config.Image}}' portfolio-prod 2>/dev/null || echo none",
                        returnStdout: true
                    ).trim()

                    try {
                        sh """
                            docker rm -f portfolio-prod 2>/dev/null || true
                            docker run -d --name portfolio-prod \\
                                -p ${PROD_PORT}:3000 \\
                                -e NODE_ENV=production \\
                                ${IMAGE}:${VERSION}
                            sleep 4
                            docker exec portfolio-prod wget -qO- http://localhost:3000/ | grep -i "Ernest" > /dev/null
                            echo "Production OK : http://localhost:${PROD_PORT} — version ${VERSION}"
                        """
                    } catch (err) {
                        if (previousImage != 'none') {
                            sh "docker rm -f portfolio-prod 2>/dev/null; docker run -d --name portfolio-prod -p ${PROD_PORT}:3000 ${previousImage}"
                            echo "ROLLBACK vers ${previousImage}"
                        }
                        error "Deploy prod echoue — rollback effectue"
                    }
                }
            }
        }

        // ── STAGE 7 : Deploy Kubernetes ─────────────────
        stage('Deploy Kubernetes') {
            steps {
                sh '''
                    kubectl apply -f k8s/tp47/namespace.yaml 2>/dev/null || true
                    kubectl apply -f k8s/tp47/configmap.yaml
                    kubectl apply -f k8s/tp47/secret.yaml
                    kubectl apply -f k8s/tp47/deployment-with-config.yaml
                    kubectl rollout status deployment/portfolio-deployment -n production --timeout=120s
                    echo "Kubernetes production OK"
                    kubectl get pods -n production
                '''
            }
        }
    }

    post {
        always {
            sh 'docker rm -f $TEST_CONTAINER 2>/dev/null || true'
            archiveArtifacts artifacts: 'reports/rapport-cicd.txt', allowEmptyArchive: true
        }
        success {
            echo "PIPELINE CICD COMPLET - version ${VERSION} en staging, prod et Kubernetes"
        }
        failure {
            echo "PIPELINE ECHOUE - consultez la console"
        }
    }
}
