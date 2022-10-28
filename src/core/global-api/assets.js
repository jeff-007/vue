/* @flow */

import { ASSET_TYPES } from 'shared/constants'
import { isPlainObject, validateComponentName } from '../util/index'

export function initAssetRegisters (Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  // 遍历 ASSET_TYPES 数组，为 Vue 定义相应方法
  // ASSET_TYPES 中包括了 directive、component、filter
  ASSET_TYPES.forEach(type => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      // 判断是否传入了第二个参数，未传入则获取之前定义过的全局组件（过滤器或者指令）
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id)
        }
        // Vue.component('comp', { template: '' })
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id
          // 把一个包含组件配置（选项）的对象通过 Vue.extend 方法转换为创建组件的构造函数（也是 Vue 构造函数的子类）
          // Vue.options._base = Vue 在 src/core/global-api/index.js 中定义
          definition = this.options._base.extend(definition)
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition }
        }
        // 全局注册，存储资源并赋值
        // this.options['components']['comp'] = definition
        // 此处的 this 指向Vue的构造函数（最终是通过 Vue.filter、Vue.component 方式来调用）
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
