// Pipeline CI/CD — Portfolio MBARGA Ernest
// TP 3.5 : Pipeline as Code
pipeline {
    agent any

    parameters {
        string(name: 'DOCKERHUB_ID', defaultValue: 'mbargaernest', description: 'Identifiant Docker Hub')
        booleanParam(name: 'PUSH', defaultValue: true, description: "Pousser l'image sur Docker Hub")
    }

    environment {
        IMAGE          = "${params.DOCKERHUB_ID}/mbarga-portfolio"
        VERSION        = "1.0.${env.BUILD_NUMBER}"
        TEST_CONTAINER = "test-portfolio-${env.BUILD_NUMBER}"
    }

    options {
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Build image') {
            steps {
                sh 'docker build -t $IMAGE:$VERSION -t $IMAGE:latest .'
            }
        }

        stage("Tests d'acceptance") {
            steps {
                sh '''
                    docker rm -f $TEST_CONTAINER 2>/dev/null || true
                    docker run -d --name $TEST_CONTAINER -p 3001:3000 $IMAGE:$VERSION
                    sleep 4

                    mkdir -p reports
                    echo "=== RAPPORT DE BUILD ===" > reports/rapport.txt
                    echo "Date     : $(date)"       >> reports/rapport.txt
                    echo "Build    : #$BUILD_NUMBER" >> reports/rapport.txt
                    echo "Image    : $IMAGE:$VERSION" >> reports/rapport.txt
                    echo ""                          >> reports/rapport.txt

                    echo "--- Test 1 : HTTP 200 ---" | tee -a reports/rapport.txt
                    docker exec $TEST_CONTAINER wget -qO- http://localhost:3000/ > /dev/null && \
                      echo "PASS : HTTP 200 OK" | tee -a reports/rapport.txt

                    echo "--- Test 2 : Titre Ernest ---" | tee -a reports/rapport.txt
                    docker exec $TEST_CONTAINER wget -qO- http://localhost:3000/ | grep -i "Ernest" > /dev/null && \
                      echo "PASS : Titre present" | tee -a reports/rapport.txt

                    echo "--- Test 3 : Email present ---" | tee -a reports/rapport.txt
                    docker exec $TEST_CONTAINER wget -qO- http://localhost:3000/ | grep "mbargaernest80@gmail.com" > /dev/null && \
                      echo "PASS : Email present" | tee -a reports/rapport.txt

                    echo "--- Test 4 : index.html ---" | tee -a reports/rapport.txt
                    docker exec $TEST_CONTAINER wget -qO- http://localhost:3000/index.html | grep -i "Ernest" > /dev/null && \
                      echo "PASS : index.html OK" | tee -a reports/rapport.txt

                    echo "" >> reports/rapport.txt
                    echo "=== TOUS LES TESTS PASSES ===" | tee -a reports/rapport.txt
                    cat reports/rapport.txt
                '''
            }
        }

        stage('Push Docker Hub') {
            when { expression { params.PUSH } }
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
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker rm -f $TEST_CONTAINER 2>/dev/null || true'
            archiveArtifacts artifacts: 'reports/rapport.txt', allowEmptyArchive: true
        }
        success {
            echo "Build ${VERSION} reussi — image disponible sur Docker Hub"
        }
        failure {
            echo "Echec du pipeline — consultez la console"
        }
    }
}
