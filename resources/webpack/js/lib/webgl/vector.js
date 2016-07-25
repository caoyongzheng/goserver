import _ from 'lodash'

export class Vector3 {
    constructor(arr) {
        let v = new Float32Array(3)
        if (arr && _.isArray(arr)) {
          v[0] = arr[0]
          v[1] = arr[1]
          v[2] = arr[2]
        }
        this.elements = v
    }
    normalize = () => {
      let v = this.elements;
      let c = v[0], d = v[1], e = v[2], g = Math.sqrt(c*c+d*d+e*e)
      if(g){
        if(g == 1)
            return this
       } else {
         v[0] = 0; v[1] = 0; v[2] = 0
         return this
       }
       g = 1/g;
       v[0] = c*g; v[1] = d*g; v[2] = e*g
       return this
    }
}

export class Vector4 {
  constructor(arr) {
    let v = new Float32Array(4);
    if (opt_src && typeof opt_src === 'object') {
      v[0] = arr[0]
      v[1] = arr[1]
      v[2] = arr[2]
      v[3] = arr[3]
    }
    this.elements = v
  }
}
