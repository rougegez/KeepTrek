import React from 'react';
import styles from './Attachments.module.css';
import { Plus } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Car, StickyNote, Hotel , Ellipsis} from 'lucide-react';

const attachments = [
  { icon: <Car size={18}/>, name: 'Fuel Receipt' },
  { icon: <StickyNote size={18}/>, name: 'ESCAPE Penang Tickets' },
  { icon: <Hotel size={18}/>, name: 'Hotel Receipt' },
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
        <div className="bg-gray-100 p-4 rounded-full size-10 flex items-center justify-center mr-2">
          <p>{attachment.icon}</p>
        </div>
        {/* <img src={attachment.icon} alt={attachment.name} className={styles.attachmentIcon} /> */}
        <span className={styles.attachmentName}>{attachment.name}</span>
        <Button size="icon" variant="ghost" className="rounded-full">
              <Ellipsis />
            </Button>
      </li>
    ))}
    <li className={styles.attachmentItem}>
      <Button className={styles.addFileButton} size="icon"><Plus className={styles.plusIcon}/></Button>
      <span className={styles.attachmentAddText}>Add File...</span>
    </li>
  </ul>
</section >
);

export default Attachments;