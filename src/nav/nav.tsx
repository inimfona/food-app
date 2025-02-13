import { useState,useEffect } from 'react'
import styles from './nav.module.css'
import { signOut } from 'firebase/auth'
import { sign } from '../configure/configure'
import {  useNavigate } from 'react-router-dom'
import { db } from '../configure/configure';
import {  getDoc, doc, setDoc } from "firebase/firestore";

interface User {
  id: string;
  email: string;
  username: string;
}
export const Nav = () => {
    const [burger ,setburger]=useState(false)
    const navigate = useNavigate()
    const [userauth, setUserData] = useState<User | null>(null);
    const fetchData = async () => {
      const currentUser = sign.currentUser; // Get the current user from Firebase auth
  
      if (!currentUser) {
        return; // Don't proceed if there's no logged-in user
      }
  
      try {
        // Reference the document for the current user
        const userDocRef = doc(db, "auth", currentUser.uid); // Assuming the document ID is the user's UID
        const userDocSnap = await getDoc(userDocRef);
  
        if (userDocSnap.exists()) {
          // If the document exists, set the data
          setUserData({ id: userDocSnap.id, ...userDocSnap.data() } as User);
        } else {
          console.log('No such document!');
          // Create a new document if it doesn't exist
          await setDoc(userDocRef, {
            userId: currentUser.uid,
            email: currentUser.email,
            username: currentUser.displayName || "Unknown",
            });
          console.log("New document created!");
          fetchData(); // Fetch the newly created document
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } 
    };
  
    useEffect(() => {
      fetchData();
    }, [sign.currentUser]); 
  return (
    <> 
    {
      burger &&
      <div className={styles.navclose}>
      <div className={styles.linkcon3}>
        <div  className={styles.float}>
        <svg xmlns="http://www.w3.org/2000/svg" onClick={
          ()=>{
            setburger(false)
          }
        } width="30" height="30" fill="currentColor" className='pointer' color="white"viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
        </svg>
        </div>
        <a className={styles.link} href="">Exams</a><br />
        <a className={styles.link} href="">Result</a><br />
        <a className={styles.link} href="">Logout</a><br />
      </div>
   </div>
    }
    <div className='container mx-auto lg:px-20 '>
       <div className={styles.box}>
            <div className={styles.night}><p>{userauth?.username}</p></div>
            <div className={styles.linkcon}>
                <a className={styles.link2} href="">Exams</a>
                <a className={styles.link2} href="">Result</a>
                <a className={styles.link2} href=""onClick={()=>{
                  async(e:any)=>{
                    e.preventDefault();
                    try{
                      await signOut(sign)
                    }catch(e){
                      console.log(e)
                    }
                  }
                  
                  navigate(`/login`);
                }}>Logout</a>
                
            </div>
            <div className={styles.linkcon2}>
                <svg xmlns="http://www.w3.org/2000/svg" onClick={
          ()=>{
            setburger(true)
          }
        } color="white" width="30" height="30" fill="currentColor" className='pointer'  viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                </svg>
            </div>
       </div>
    </div>
    
  </> 
  )
}
