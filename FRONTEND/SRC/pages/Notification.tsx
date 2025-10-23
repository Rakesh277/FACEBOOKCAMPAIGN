import React from 'react';
import Layout from '../components/layout/Layout';
import styles from './Notification.module.css';


const Notification: React.FC = () => {
  return (
    <Layout>
    <div className={styles.notificationPage}>
      <h2 className={styles.notificationTitle}>Notifications</h2>
      <p className={styles.notificationMessage}>You have no new notifications.</p>
    </div>
    </Layout>
  );

};


export default Notification;
