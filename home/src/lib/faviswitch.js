const faviconLink = document.querySelector('link[rel=icon]')

if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  faviconLink.href = '/stylEase-dark.svg'
} else {
  faviconLink.href = '/stylEase-light.svg'
}