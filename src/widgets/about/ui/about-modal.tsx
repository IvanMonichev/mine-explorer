import { Descriptions, Modal } from 'antd'

import { APP_INFO } from '@/shared/constants/app-info'

import styles from './about-modal.module.css'

interface AboutModalProps {
  open: boolean
  onCancel: () => void
}

export const AboutModal = ({ open, onCancel }: AboutModalProps) => (
  <Modal
    centered
    className={styles['about-modal']}
    footer={null}
    onCancel={onCancel}
    open={open}
    title='О приложении'
    width={320}
  >
    <Descriptions
      className={styles['details']}
      colon={false}
      column={1}
      items={[
        { key: 'name', label: 'Название', children: APP_INFO.name },
        { key: 'version', label: 'Версия', children: APP_INFO.version },
        { key: 'author', label: 'Автор', children: APP_INFO.author },
        { key: 'city', label: 'Город', children: APP_INFO.city }
      ]}
      size='small'
    />
  </Modal>
)
