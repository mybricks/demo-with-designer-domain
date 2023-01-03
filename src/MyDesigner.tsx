import React, {useCallback, useRef} from "react";
import {message} from "antd";
import css from "./MyDesigner.less";

import Designer from '@mybricks/designer-domain';

const config = {
  // plugins: [servicePlugin()],
  comLibLoader(desc) {//加载组件库
    return new Promise((resolve, reject) => {
      resolve([`https://f2.eckwai.com/kos/nlav12333/fangzhou/pub/comlibs/5665_1.0.17/2022-11-02_17-27-26/edit.js`])
      //resolve([testLib])
    })
  },
  contentLoader() {//加载内容
    return new Promise((resolve, reject) => {
      let pageContent = window.localStorage.getItem('--domain--')
      if (pageContent) {
        pageContent = JSON.parse(pageContent)

        resolve(pageContent)
      } else {
        resolve(null)
      }
    })
  }
}

export default function MyDesigner() {
  const designerRef = useRef<{ switchActivity, dump, toJSON }>()

  const save = useCallback(() => {//保存
    const json = designerRef.current?.dump()

    window.localStorage.setItem('--mybricks--', JSON.stringify(json))
    message.info(`保存完成`)
  }, [])

  const getJSON = useCallback(() => {
    const title = '我的流程'//页面标题
    const json = designerRef.current?.toJSON()

    const jsonStr = JSON.stringify(json)

    const linkNode = document.createElement('a')
    linkNode.download = `${title}.json`
    linkNode.style.display = 'none'
    const blob = new Blob([jsonStr])
    linkNode.href = URL.createObjectURL(blob)

    document.body.appendChild(linkNode)
    linkNode.click()

    document.body.removeChild(linkNode)
  }, [])

  return (
    <>
      <div className={css.show}>
        <div className={css.toolbar}>
          <div className={css.tt}>&lt;定制您自己的领域建模方案&gt;</div>
          <div className={css.btns}>
            {/*<button onClick={switchSlider}>激活连接器插件</button>*/}
          </div>
          <button className={css.primary} onClick={save}>保存</button>
          <button onClick={getJSON}>toJSON</button>
        </div>
        <div className={css.designer}>
          <Designer config={config} ref={designerRef}/>
        </div>
      </div>
    </>
  )
}