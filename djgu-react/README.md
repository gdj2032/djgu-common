react 组件库 version >= 16.8 node > 16

# 版本更新内容

## v1.0.0
  usePagination
  useVirtualList
  openModal/openModal2
  cmx
  randomKey
  downloadFile

## v1.0.1
  hooks-useQuery
  isURL

# 使用

```js
npm i @djgu/react-comps
yarn add @djgu/react-comps
```

# hooks

## usePagination 表格分页查询

```js
const {
  tableProps, paginationProps, debounceRefresh
} = usePagination<InterFace>(async ({ limit, offset, current }) => {
  // 接口请求
  return {
    dataSource: [],
    total: 0
  }
}, [])
```

## useVirtualList 虚拟列表加载更多

```js
const {
  dataSource, loading, debounceRefresh
} = useVirtualList<InterFace>(async ({ limit, offset, current }) => {
  // 接口请求
  return {
    dataSource: [],
    total: 0
  }
})
```

## useQuery 获取地址路径参数 默认为当前页面路径 可传参

```js
const {} = useQuery()
const { activeTab } = useQuery('https://www.npmjs.com/package/@djgu/react-comps?activeTab=readme')
```

# 弹窗 openModal(react18.0之前) / openModal2(react18.0之后) (以 antd5.x 为例)

## modal.tsx

```js
import React, { useState } from 'react';
import { Modal } from 'antd';
import { IModalProps } from '@/utils/openModal';

export interface IDemoModalProps extends IModalProps {
}

export function DemoModal(props: IDemoModalProps) {
  const { close, visible, ...arg } = props;
  const [loading, setLoading] = useState(false)

  const handleOk = () => {
    setLoading(true)
    close?.(true)
    setLoading(false)
  }
  return (
    <Modal
      open={visible}
      title="demo"
      okText="确定"
      cancelText="取消"
      onCancel={() => close?.()}
      onOk={handleOk}
      confirmLoading={loading}
      {...arg}
    >
      DemoModal
    </Modal>
  )
}
```

## openModal

```js
const { destroy } = openModal<IDemoModalProps>(DemoModal, {
  afterClose: (isOk) => {
    destroy()
    if (isOk) {
      // ...
    }
  }
})
```

# cmx 加减乘除计算 去除精度问题


```js

cmx.add(1, 1)
cmx.sub(1, 1)
cmx.mul(1, 1)
cmx.div(1, 1)

```

# randomKey 随机值

# downloadFile blob文件下载

# isURL 判断url是否合法
