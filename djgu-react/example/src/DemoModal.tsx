import * as React from 'react';
import { useState } from 'react';
import { Modal } from 'antd';
import { IModalProps } from '../../dist/utils/openModal';

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
