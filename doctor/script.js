'use strict'

const linkMsg = '<h2>You are authenticated!</h2><p>Download your data: <a href="web+phr://s3.eu-central-1.amazonaws.com/ephri/encounter.json">click here</a></p>'

const showLink = () => {
  document.getElementById('download').innerHTML = linkMsg

  const form = document.getElementById('loginform')
  form.parentNode.removeChild(form)
}
