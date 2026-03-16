pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo '拉取代码...'
                checkout scm
            }
        }
        stage('Install Dependencies') {
            steps {
                echo '安装依赖...'
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                echo '构建项目...'
                sh 'npm run build' // 假设有 build 脚本
            }
        }
        stage('Test') {
            steps {
                echo '运行测试...'
                sh 'npm test'     // 假设有 test 脚本
            }
        }
        // 可以按需添加部署阶段
    }
    post {
        success {
            echo '构建成功！'
        }
        failure {
            echo '构建失败，请检查日志。'
        }
    }
}
