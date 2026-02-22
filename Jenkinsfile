pipeline {
    agent any

    environment {
        CI = 'true'
        NODE_OPTIONS = '--max-old-space-size=4096'
    }

    triggers {
        // Auto-trigger on GitHub push/PR via webhook
        githubPush()
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout this repo (automated-tests)
                checkout scm

                // Clone the app repos for reference/context if needed
                dir('repos/backend') {
                    git url: 'https://github.com/absswanii/24hourservice-Backend.git',
                        branch: 'main',
                        credentialsId: 'github-pat'
                }
                dir('repos/frontend') {
                    git url: 'https://github.com/absswanii/24hr-New-UI.git',
                        branch: 'main',
                        credentialsId: 'github-pat'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
                bat 'npx playwright install chromium --with-deps'
            }
        }

        stage('Smoke Tests') {
            steps {
                bat 'npx playwright test --project=chromium --grep @smoke --reporter=list,junit'
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'test-results/**/*.xml'
                }
            }
        }

        stage('E2E Tests') {
            steps {
                bat 'npx playwright test --project=chromium --reporter=html,json,junit'
            }
        }

        stage('API Tests') {
            steps {
                bat 'npx playwright test --project=chromium --grep @api --reporter=list,junit'
            }
        }
    }

    post {
        always {
            // Archive Playwright report & results
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true

            // Publish JUnit results for Jenkins test trend graphs
            junit allowEmptyResults: true, testResults: 'test-results/**/*.xml'

            // Publish HTML report (requires HTML Publisher plugin)
            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report',
                reportTitles: 'Playwright Test Report'
            ])
        }

        success {
            echo '✅ All tests passed!'
        }

        unstable {
            echo '⚠️ Some tests failed — check the Playwright report.'
        }

        failure {
            echo '❌ Pipeline failed — check the logs.'
        }
    }
}
