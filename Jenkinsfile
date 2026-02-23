pipeline {
    agent any

    tools {
        nodejs 'Node18'  // Must be configured in Jenkins Global Tool Configuration
    }

    environment {
        CI = 'true'
        NODE_OPTIONS = '--max-old-space-size=4096'
        
        // Test environment URLs
        BASE_URL = 'https://dev.24hrtruckfix.com'
        API_BASE_URL = 'https://two4hourservice-backend-1nt5.onrender.com'
        
        // Test credentials (stored in Jenkins Credentials)
        ADMIN_EMAIL = credentials('admin-email')
        ADMIN_PASSWORD = credentials('admin-password')
        DISPATCHER_EMAIL = credentials('dispatcher-email')
        DISPATCHER_PASSWORD = credentials('dispatcher-password')
        CLIENT_EMAIL = credentials('client-email')
        CLIENT_PASSWORD = credentials('client-password')
        VIEWER_EMAIL = credentials('viewer-email')
        VIEWER_PASSWORD = credentials('viewer-password')
        TEST_2FA_CODE = credentials('test-2fa-code')
        
        // Notification credentials
        TELEGRAM_TOKEN = credentials('telegram-token')
        TELEGRAM_CHAT_ID = credentials('telegram-chat-id')
        SLACK_CHANNEL = '#qa-alerts'
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
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                bat 'npm ci'
                bat 'npx playwright install chromium firefox --with-deps'
            }
        }

        stage('Auth Tests') {
            steps {
                echo '🔐 Running authentication tests...'
                bat 'npx playwright test tests/e2e/auth.spec.ts --reporter=line,junit'
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'test-results/**/*.xml'
                }
            }
        }

        stage('Dashboard Tests') {
            steps {
                echo '📊 Running dashboard navigation tests...'
                bat 'npx playwright test tests/e2e/dashboard.spec.ts --reporter=line,junit'
            }
        }

        stage('Ticket Tests') {
            steps {
                echo '🎫 Running ticket management tests...'
                bat 'npx playwright test tests/e2e/tickets.spec.ts --reporter=line,junit'
            }
        }

        stage('API Tests') {
            steps {
                echo '🔌 Running API endpoint tests...'
                bat 'npx playwright test tests/api/api.spec.ts --reporter=line,junit'
            }
        }

        stage('Full Regression') {
            steps {
                echo '🧪 Running full regression suite...'
                bat 'npx playwright test --project=chromium --grep @regression --reporter=html,json,junit'
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
                reportTitles: '24Hr Service Test Report'
            ])
        }

        success {
            echo '✅ All tests passed!'
            
            // Slack notification
            slackSend(
                channel: env.SLACK_CHANNEL,
                color: '#27AE60',
                message: """
✅ *PASSED* — 24HR Truck Services Regression

*Job:* ${env.JOB_NAME} #${env.BUILD_NUMBER}
*Branch:* ${env.GIT_BRANCH ?: 'N/A'}
*Duration:* ${currentBuild.durationString.replace(' and counting', '')}
🔗 <${env.BUILD_URL}|View Build>
📊 <${env.BUILD_URL}Playwright_20Report/|Test Report>
                """
            )
            
            // Telegram notification
            script {
                def message = """✅ *PASSED* — 24HR Regression
*Job:* ${env.JOB_NAME} #${env.BUILD_NUMBER}
*Duration:* ${currentBuild.durationString.replace(' and counting', '')}
[View Report](${env.BUILD_URL})"""
                
                bat """curl -s -X POST https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage -d chat_id=${TELEGRAM_CHAT_ID} -d parse_mode=Markdown -d text="${message.replaceAll('\n', '%0A')}" """
            }
        }

        unstable {
            echo '⚠️ Some tests failed — check the Playwright report.'
            
            slackSend(
                channel: env.SLACK_CHANNEL,
                color: '#F39C12',
                message: """
⚠️ *UNSTABLE* — 24HR Truck Services Regression

*Job:* ${env.JOB_NAME} #${env.BUILD_NUMBER}
*Branch:* ${env.GIT_BRANCH ?: 'N/A'}
*Duration:* ${currentBuild.durationString.replace(' and counting', '')}
🔗 <${env.BUILD_URL}|View Build>
📊 <${env.BUILD_URL}Playwright_20Report/|Test Report>
                """
            )
            
            script {
                def message = """⚠️ *UNSTABLE* — 24HR Regression
*Job:* ${env.JOB_NAME} #${env.BUILD_NUMBER}
Some tests failed. [View Details](${env.BUILD_URL})"""
                
                bat """curl -s -X POST https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage -d chat_id=${TELEGRAM_CHAT_ID} -d parse_mode=Markdown -d text="${message.replaceAll('\n', '%0A')}" """
            }
        }

        failure {
            echo '❌ Pipeline failed — check the logs.'
            
            slackSend(
                channel: env.SLACK_CHANNEL,
                color: '#C0392B',
                message: """
❌ *FAILED* — 24HR Truck Services Regression

*Job:* ${env.JOB_NAME} #${env.BUILD_NUMBER}
*Branch:* ${env.GIT_BRANCH ?: 'N/A'}
*Failed Stage:* ${env.STAGE_NAME}
*Duration:* ${currentBuild.durationString.replace(' and counting', '')}
🔗 <${env.BUILD_URL}|View Failure Details>
📊 <${env.BUILD_URL}Playwright_20Report/|Test Report>
                """
            )
            
            script {
                def message = """❌ *FAILED* — 24HR Regression
*Job:* ${env.JOB_NAME} #${env.BUILD_NUMBER}
*Failed Stage:* ${env.STAGE_NAME}
[View Details](${env.BUILD_URL})"""
                
                bat """curl -s -X POST https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage -d chat_id=${TELEGRAM_CHAT_ID} -d parse_mode=Markdown -d text="${message.replaceAll('\n', '%0A')}" """
            }
        }
    }
}
