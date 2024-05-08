import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Notification() {
    const notify = () => {
        toast.success('Wow so easy !',{
            theme:'dark',
            position:"bottom-right",
            
        });
    }

    return (
        <div>
            <button onClick={notify}>Notify</button>
            {/* ToastContainer must be rendered somewhere in the component tree */}
            <ToastContainer />
        </div>
    )
}

export default Notification;
