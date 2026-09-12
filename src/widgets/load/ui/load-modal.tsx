import { useState } from 'react'

import type { UploadFile, UploadProps } from 'antd'
import { Modal, Typography, Upload } from 'antd'

import styles from './load-modal.module.css'

const { Dragger } = Upload
const { Text } = Typography

interface LoadModalProps {
  open: boolean
  onCancel: () => void
  onLoad: (file: File) => void
}

export const LoadModal = ({ open, onCancel, onLoad }: LoadModalProps) => {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const selectedFile = fileList[0]?.originFileObj

  const uploadProps: UploadProps = {
    accept: '.xml,text/xml,application/xml',
    beforeUpload: () => false,
    fileList,
    maxCount: 1,
    onChange: ({ fileList: nextFileList }) => {
      setFileList(nextFileList)
    }
  }

  const handleCancel = () => {
    setFileList([])
    onCancel()
  }

  const handleLoad = () => {
    if (!selectedFile) return

    onLoad(selectedFile)
    setFileList([])
  }

  return (
    <Modal
      cancelText='Отмена'
      centered
      destroyOnHidden
      okButtonProps={{ disabled: !selectedFile }}
      okText='Загрузить'
      onCancel={handleCancel}
      onOk={handleLoad}
      open={open}
      title='Загрузка схемы XML'
    >
      <Dragger className={styles['upload']} {...uploadProps}>
        <Text>Выберите файл схемы на компьютере или перетащите его</Text>
      </Dragger>
    </Modal>
  )
}
