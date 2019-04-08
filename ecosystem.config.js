module.exports = {
    apps : [{
      name: 'camunda-mock-service',
      script: './src/app.js',
      watch: true,
      ignore_watch : ['node_modules', 'src/database', 'logs'],
      watch_options: {
        dot: true
      }
    }]
  }