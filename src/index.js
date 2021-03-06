import {array2Obj, isArray, mapValues, assign} from './util'

export function validator(configs){

  //split methods and configs
  const pureCon = {}
  const pureMeth = {}
  Object.keys(configs).forEach(key => {
    let value = configs[key]
    if(key === 'onSave'){
      pureMeth[key] = value
    } else {
      value = isArray(value) ? array2Obj(value): value
      pureCon[key] = value
    }
  })

  //default all values isn`t dirty and init allPass
  const validator = mapValues(pureCon, value => ({dirty: false}))
  validator.allPass = true
  validator.allDone = true
  validator.invalidFileds = []
  validator.pendingFileds = []
  //merge rules
  const rules = assign(Vue.rules, configs.rules)
  if(!rules || Object.keys(rules).length === 0){
    throw Error('no validate rule, please check')
  }

  const validatorWatch = mapValues(pureCon, (validate, key) => {
    return function(){
      let self = this
      this.validator[key] =  mapValues(validate, (singleValidatePara, singleValidateFunc) => {
        const result = rules[singleValidateFunc](self[key], singleValidatePara)
        if(isPromise(result)){
          validator.pendingFileds.push(key)
          self.validator[key].isValidating = true
          validator.allDone = false
          result.then((promisResult) => {
            const index = validator.pendingFileds.indexOf(key)
            if(index >= 0){
              validator.pendingFileds.splice(index, 1)
            }
            self.validator[key].valid = !!promisResult
            self.validator[key].isValidating = false
            if(validator.pendingFileds.length === 0){
              validator.allDone = true
            }
          })
        }
        if(!result){
          self.validator.allPass = false
          self.validator.invalidFileds.push(key)
        }
        return {
          valid: result
          isValidating: false
        }
      })
      this.validator[key].dirty = true
    }
  })
  return function(options){
    const data = options.data()
    const watch = options.watch
    options.data = function(){
      return assign(data, {validator: validator})
    }
    options.watch =assign(validatorWatch, watch)
    if(pureMeth['onSave']){
      options.methods = mapValues(options.methods, (fn, key) => {
        if(key === pureMeth['onSave']){
          return function(argu){
            const self = this
            mapValues(validatorWatch, fn => fn.call(self))
            return fn.apply(this, argu)
          }
        } else return fn
      })
    }
    return options
  }
}
