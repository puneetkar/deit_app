pipeline {
  agent any
  options { timestamps(); ansiColor('xterm') }

  environment {
    PROJECT_ROOT = '/home/puneetk/gsuit_auto'
    BACKEND_DIR  = '/home/puneetk/gsuit_auto/dietapp'
    FRONTEND_DIR = '/home/puneetk/gsuit_auto/frontend'
    VENV         = '/home/puneetk/gsuit_auto/dietapp/.venv'
    DJANGO_SETTINGS_MODULE = 'dietapp.settings'
    PYTHON       = '/usr/bin/python3'
  }

  stages {
    stage('Backend | Install + Migrate') {
      steps {
        sh '''
          set -e
          cd "$BACKEND_DIR"
          $PYTHON -m venv "$VENV"
          . "$VENV/bin/activate"
          pip install --upgrade pip
          pip install -r requirements.txt
          python manage.py migrate --noinput
          python manage.py check
        '''
      }
    }

    stage('Frontend | Install + Build') {
      steps {
        sh '''
          set -e
          cd "$FRONTEND_DIR"
          (npm ci || npm install)
          npm run build
        '''
      }
    }

    stage('Archive build') {
      steps {
        archiveArtifacts artifacts: 'frontend/dist/**', fingerprint: true, allowEmptyArchive: false
      }
    }
  }
}
