// 
import VNode from 'core/vdom/vnode'
import type { VNodeComponentOptions } from 'types/vnode'
import { get, clone } from 'lodash'

type TAllProps = {
    formatter?: (a: Object) => VNode,
    key?: String | Number | undefined
}
type TMountVNode = Required<VNode>
type editPropsFn = (props: Object | undefined) => Object | undefined
/**
 * author: mczhaozl 
 * vuejsx 文档：https://cn.vuejs.org/guide/extras/render-function.html
 * 为什么需要克隆节点
 * 1.VNode一经创建则不能修改属性，如果需要修改属性只能重新克隆一个vnode 并在创建过程中引入新的属性
 * -------------------------------------------------------------------
 * 克隆节点有什么用
 * 1.UI 组件可以根据根据内部插槽节点数据进行克隆赋予组件更强更加自适应的节点功能
 * 2.使得表单组件变得更加的智能（
 * 类比ant design 的 Form Item，与 Element UI 的 Form Item
 * ant desgin 通过克隆可以接管子节点的属性 
 * 例如无须传入 value onChange 值即可完成事件和值的绑定
 * 引入开发者未定义的量，实现表单联动，帮助开发者减轻工作量 例如id，key 等
 * ）
 * -------------------------------------------------------------------
 * 
 */


export function editElement(vnode: TMountVNode, cb: editPropsFn) {
    const { Ctor, propsData, children } = vnode.componentOptions as VNodeComponentOptions
    const allProps = Object.assign({}, propsData, cb(propsData)) as TAllProps
    if (get(vnode, "data.scopedSlots.default")) {
        allProps.formatter = function (row) {
            return vnode.data?.scopedSlots?.default({ row });
        };
    }
    // h() 是 hyperscript 的简称，该函数与vm
    const h = vnode.context.$createElement;
    const newNode = h(new Ctor, { key: allProps.key || vnode.key, props: allProps }, children)
    newNode.data = clone(vnode.data);
    newNode.isCloned = true
    return newNode;
}

export function cloneElement(vnode: TMountVNode, newProps: Object) {
    return editElement(vnode, () => newProps)
}