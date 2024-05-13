const units = ['bytes', 'KB', 'MB'];

function niceBytes(x: number){

  let l = 0, n = x || 0;

  while(n >= 1000 && ++l){
      n = n/1000;
  }

  return(n.toFixed(1) + ' ' + units[l]);
}

export { niceBytes }
