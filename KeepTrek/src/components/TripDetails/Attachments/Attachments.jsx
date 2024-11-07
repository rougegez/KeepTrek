import React from 'react';
import styles from './Attachments.module.css';
import { Plus } from 'lucide-react'; 

const attachments = [
  { icon: '✈️', name: 'WeiLeeGan_KULtoBKK.pdf' },
  { icon: '📄', name: 'WatArun_GroupTicket.pdf' },
  { icon: '🏨', name: 'PhatumWan_Hotel2D3N.pdf' },
];

// I think icon can be a string based cateogry and icons are assigned locally.

const Attachments = () => (
  <section className={styles.tripAttachments}>
  <div className={styles.attachmentHeaderContainer}>
    <h2 className={styles.attachmentTitle}>Attachments</h2>
  </div>
  <ul className={styles.attachmentList}>
    {attachments.map((attachment, index) => (
      <li key={index} className={styles.attachmentItem}>
        <div className={styles.attachmentIconContainer}>
          <p>{attachment.icon}</p>
        </div>
        {/* <img src={attachment.icon} alt={attachment.name} className={styles.attachmentIcon} /> */}
        <span className={styles.attachmentName}>{attachment.name}</span>
        <button className={styles.attachmentAction}>
          <img src='../src/assets/more.svg' alt="Action" className={styles.actionIcon} />
        </button>
      </li>
    ))}
    <li className={styles.attachmentItem}>
      <button className={styles.addFileButton}><Plus className={styles.plusIcon}/></button>
      <span className={styles.attachmentAddText}>Add File...</span>
    </li>
  </ul>
</section >
);

export default Attachments;