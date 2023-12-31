import React, { useContext } from 'react'
import Navbar from '../Navbar'
import { useState } from 'react';
import { useEffect } from 'react';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../utils/AuthContext';

function CreatorGroups() {

    const [modalOpen, setModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const openEditModal = () => {
        setEditModalOpen(true);
      };
    
      const closeEditModal = () => {
          setEditModalOpen(false);
      };

    const { brand_id } = useContext(AuthContext)
  
    const openModal = () => {
      setModalOpen(true);
    };
  
    const closeModal = () => {
        setSelectedCreators([]);
        setModalOpen(false);
    };

    const [creators, setCreators] =  useState([]);
    const [groupName, setGroupName] = useState(null);

    useEffect(()=>{
        fetch(`${process.env.REACT_APP_API_URL}/get_all_creators`)
        .then(response => response.json())
        .then(response => {
            setCreators(response);
        })
        .catch(err => console.log(err))
    },[])

    const [selectedCreators, setSelectedCreators] = useState([]);

    const handleSelectChange = (selectedOption) => {
        if(!selectedCreators.includes(selectedOption.value)){
            setSelectedCreators([...selectedCreators, selectedOption.value]);
        }
    };

    const options = creators.map((creator) => ({
        value: creator._id,
        label: (
            <div className='block'>
                <div className='font-bold'>{ creator.firstName } { creator.lastName}</div>
                <div className='capitalize'>{ creator.creatorType } - Ksh. { creator.averageEarning} </div>
                <div className='flex flex-wrap gap-2'>{ creator.industries.map( ind => ( <div className='p-2 bg-gray-300 rounded-md text-sm text-black'>{ind}</div>))}</div>
            </div> 
        ),
        }));

        const handleRemove = (id) => {
            const updatedSelected = selectedCreators.filter( item =>  item !== id);
            setSelectedCreators(updatedSelected);
        }

        const handleSubmit = () => {
            if(groupName === null){
                toast.error('Add a Group name', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    });
                return;
            }

            if(selectedCreators.length < 2){
                toast.error('Select at least 2 creators', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    });
                return;
            }

            fetch(`${process.env.REACT_APP_API_URL}/creator_groups`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    brand_id,
                    groupName,
                    selectedCreators 
                })
            })
            .then((response)=> {
                if(response.ok){
                    toast.success('Success', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        });
                    closeModal();
                }else{
                    toast.error("You have a creators' group with the same name.", {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        });
                }
            })
            .catch(err =>{
                toast.error('Failed. Server Error', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    });
            })
            
        }


        const [groups, setGroups] = useState([]);

        useEffect(()=>{
            fetch(`${process.env.REACT_APP_API_URL}/creator_groups/${brand_id}`)
            .then(response => response.json())
            .then(response => {
                setGroups(response);
            })
            .catch(err => {
                console.log(err);
            })
        })
        

        const handleDeleteGroup = (id) => {
            fetch(`${process.env.REACT_APP_API_URL}/creator_groups/${id}`,{
                method: 'DELETE'
            })
            .then(()=>{
                toast.success('Deleted', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    });
            })
            .catch(err =>{
                toast.error('Failed. Server Error', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    });
            })
        }

        const [viewData, setViewData] = useState(null);
        const [editGroupName, setEditGroupName] = useState(null);

        const handleRemoveCreatorFromGroup = (id) => {
            const updatedSelected = viewData.selectedCreators.filter(item => item !== id);
            let newViewData = {
                ...viewData, selectedCreators: updatedSelected
            }
            setViewData(newViewData);
        }

        const handleEdit = () => {
            fetch(`${process.env.REACT_APP_API_URL}/creator_groups/${viewData._id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({
                    groupName: editGroupName,
                    selectedCreators: viewData.selectedCreators,
                    brand_id: brand_id,
                })
            })
            .then(()=>{
                toast.success('Success', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    });
                    closeEditModal();
            })
            .catch(err =>{
                toast.error('Failed. Server Error', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    });
            })
        }

  return (
    <div className='w-full min-h-screen bg-neutral-300'>
        <Navbar />
        <ToastContainer />

        <div className='p-4 ml-16'>
            Creator Groups
        

        <div className='w-5/6 mt-5 flex justify-start lg:justify-end mx-auto'>
            <button onClick={()=> openModal()} className='bg-blue-800 text-white p-2 text-sm rounded-lg'>+ New Creators Group </button>
        </div>

        <div class=" overflow-x-auto mt-4 w-full lg:w-5/6 mx-auto">
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Group name
                        </th>
                        <th scope="col" class="px-6 py-3">
                            No. of Members
                        </th>
                        <th scope="col" class="px-6 py-3">
                            View
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Delete
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        
                        groups.length < 1 && <tr className='mt-5'><td colSpan='4' className='text-center text-black mt-5'>You Have No Creator Groups</td></tr>
                    }
                    { 
                    
                    groups.map( group => (
                    <tr key={group._id} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            {group.groupName}
                        </th>
                        <td class="px-6 py-4">
                            {group.selectedCreators.length}
                        </td>
                        <td class="px-6 py-4">
                        <button onClick={(e)=>{
                                e.preventDefault();
                                setViewData(group);
                                setEditGroupName(group.groupName);
                                openEditModal();
                            }} className='p-2 rounded-lg bg-blue-600 text-white'>
                                View
                            </button>
                        </td>
                        <td class="px-6 py-4">
                            <button onClick={(e)=>{
                                e.preventDefault();
                                handleDeleteGroup(group._id);
                            }} className='p-2 rounded-lg bg-red-600 text-white'>
                                Delete
                            </button>
                        </td>
                    </tr> 
                    ))
                    }
                   
                </tbody>
            </table>
        </div>

        </div>


        {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-800 bg-opacity-80">

                <div className="bg-white p-5 rounded-lg shadow-lg lg:w-1/2">
                    <div className='flex justify-end mb-1 lg:mb-5'>
                        <button
                            onClick={closeModal}
                            className="text-white text-xs bg-red-500 hover:bg-red-600 px-2 py-1 rounded-full  flex flex-end"
                        >
                            X
                        </button>
                    </div>

                    <div className='w-full'>
                        <div className='mb-2 text-center'>Create Content/Influencer Creator Group</div>
                        <hr />
                        <form className='mt-5 text-sm'>
                            <label>Group Name:</label>

                            <input type="text" onChange={e => setGroupName(e.target.value)} className='mt-2 p-2 rounded border border-gray-400 w-full mb-5' placeholder='Group Name' />
                            <br />
                            <div className='flex flex-wrap text-sm mb-4'>
                                {
                                    selectedCreators.map( select => {
                                    let single = creators.filter(crt => crt._id === select)
                        
                                    return (
                                    <div key={select} className='bg-gray-200 shadow-md m-1 p-2 rounded-lg flex items-center gap-4'>
                                        <div>
                                            <div className=''>
                                                {single[0].firstName} {single[0].lastName}
                                            </div>
                                            <div className='capitalize'>{ creators[0].creatorType } - Ksh. { creators[0].averageEarning} </div>
                                        </div>

                                        <button className="text-red-800" onClick={e => {
                                            e.preventDefault();
                                            handleRemove(select);
                                            }
                                        }>
                                            X
                                        </button>
                                        
                                    </div>
                                    )
                                    })   
                                }
                            </div>
                                

                            <label>Select Members:</label>

                            { creators.length > 0 && 
                            
                            <Select className='mt-2' options={options} onChange={handleSelectChange} defaultValue={{value: creators[0]._id, label: (
                                <div className='block'>
                                    <div className='font-bold'>{ creators[0].firstName } { creators[0].lastName}</div>
                                    <div className='capitalize'>{ creators[0].creatorType } - Ksh. { creators[0].averageEarning} </div>
                                    <div className='flex flex-wrap gap-2'>{ creators[0].industries.map( ind => ( <div className='p-2 bg-gray-300 rounded-md text-sm text-black'>{ind}</div>))}</div>
                                </div> 
                            )}}
                            /> }

                            <button onClick={e => {
                                e.preventDefault();
                                handleSubmit();
                            }} className='bg-blue-700 hover:bg-blue-500 text-white p-2 mt-5 rounded-lg float-right'>Save Group</button>   
                        </form>
                    </div>
                </div>
            </div>
        )}

    {editModalOpen && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-gray-800 bg-opacity-80">

                <div className="bg-white p-5 rounded-lg shadow-lg lg:w-1/2">
                    <div className='flex justify-end mb-1 lg:mb-5'>
                        <button
                            onClick={() => { setEditGroupName(null); setViewData(null); closeEditModal() }}
                            className="text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-full text-sm flex flex-end"
                        >
                            X
                        </button>
                    </div>

                    <div className='w-full'>
                        <hr />
                        <div>Group Name:</div>
                        <div className='flex'>
                            <input type='text' onChange={e=> setEditGroupName(e.target.value)} className='mt-2 p-4 rounded border border-gray-400 w-full mb-5' value={editGroupName}/>
                        </div>
                        <br />
                        <div className='flex flex-wrap text-sm mb-4'>
                            {
                                viewData.selectedCreators.map( newSelect => {
                                let single = creators.filter(crt => crt._id === newSelect)
                    
                                return (
                                <div key={newSelect} className='bg-gray-200 shadow-md m-1 p-2 rounded-lg flex items-center gap-4'>
                                    <div>
                                        <div className=''>
                                            {single[0].firstName} {single[0].lastName}
                                        </div>
                                        <div className='capitalize'>{ creators[0].creatorType } - Ksh. { creators[0].averageEarning} </div>
                                    </div>

                                    <button className="text-red-800" onClick={e => {
                                        e.preventDefault();
                                        handleRemoveCreatorFromGroup(single[0]._id);
                                        }
                                    }>
                                        X
                                    </button>
                                    
                                </div>
                                )
                                })   
                            }
                        </div>

                        <button onClick={(e)=>{
                            e.preventDefault();
                            handleEdit();
                        }} className='bg-blue-500 p-2 text-white rounded-lg float-right'>Save</button>
                            
                    </div>
                </div>
            </div>
            )}
    </div>
  )
}

export default CreatorGroups
