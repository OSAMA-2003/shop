import React from 'react'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Shield, Trash2 } from "lucide-react";

const Users = () => {
    const url = "https://shop-2-ms77.onrender.com"
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const demoteToUser = async (id) => {
        try {
            await axios.put(`${url}/api/user/make-user/${id}`)
            setUsers((prev) =>
                prev.map((u) =>
                    u._id === id ? { ...u, role: "user" } : u
                )
            );
            alert("User has been successfully demoted")
        } catch (error) {
            console.error("Error in demoting the role", error);
            alert("An error occurred while demoting the role");
        }
    };
    const promoteToAdmin = async (id) => {
        try {
            await axios.put(`${url}/api/user/make-admin/${id}`)
            setUsers((prev) =>
                prev.map((u) => (u._id === id ? { ...u, role: "admin" } : u))
            );
            alert("User has been successfully promoted to admin");

        } catch (error) {
            console.error("Error in promotion", error);
            alert("An error occurred during promotion");
        }
    }

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${url}/api/user/users`)
            if (res.data && res.data.success) {
                setUsers(res.data.data || [])
            } else {
                setUsers([])
            }
        } catch (err) {
            setUsers([])
        } finally {
            setLoading(false)
        }
    }

    const deleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?"))
            return;
        try {
            const res = await axios.delete(`${url}/api/user/delete/${id}`)
            if (res.data && res.data.success) {
                setUsers((prev) => prev.filter((u) => u._id !== id));
                alert("User has been deleted successfully");
            } else {
                alert("Deletion failed, check the server");
            }

        } catch (error) {
            console.error("Error in deleting the user");
            alert("Deletion failed");
        }
    };

    useEffect(() => {
        fetchUsers()
    }, [])



    return (
        <section className='md:ml-64 min-h-screen bg-linear-to-r from-indigo-900
    via-purple-900 to-pink-900 text-white py-24 px-6 sm:px-10'>
            <div className='max-w-6xl mx-auto '>
                <h2 className='text-4xl sm:text-5xl font-extrabold mb-12 text-center'>
                    User Management </h2>
                {
                    loading ? (
                        <div className='text-center text-gray-300 text-lg'> Loading users </div>
                    ) : users.length === 0 ? (
                        <div className='text-center text-gray-400'> There are currently no users </div>
                    ) : (
                        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
                            {users.map((user) => (
                                <div key={user._id} className='bg-white/10 border border-white/20 
                    backdrop-blur-md rounded-3xl p-6 flex flex-col items-center text-center 
                    shadow-lg hover:shadow-indigo-500/40 transition-all '>
                                    <div className='w-20 h-20 rounded-full bg-linear-to-r
                        from-indigo-500 via-purple-500 to-pink-500 flex items-center
                        justify-center mb-4 overflow-hidden '>
                                        {user.avatar ? (
                                            <img src={user.avatar} className='w-20 h-20 rounded-full object-cover' />
                                        ) : (
                                            <User className='w-10 h-10 text-white' />
                                        )}

                                    </div>
                                    <h3 className='text-xl font-bold'> {user.name}</h3>
                                    <p className='text-gray-300 text-sm mb-3'>{user.email}</p>
                                    <div className={`px-3 py-1 rounded-full text-sm font-semibold mb-4 ${user.role === "admin"
                                        ? "bg-yellow-400/80 text-black flex items-center gap-1"
                                        : "bg-cyan-500/80 text-white "
                                        }`}>
                                        {user.role === "admin" && <Shield className='w-4 h-4' />}
                                        {user.role === "admin" ? "Admin" : "User"}
                                    </div>


                                    <button
                                        onClick={() => deleteUser(user._id)}
                                        disabled={user.role !== "user"}
                                        className={`flex items-center gap-2 px-4 py-2
        rounded-lg font-semibold transition-all
    ${user.role === "admin"
                                                ? "bg-gray-500/40 cursor-not-allowed"
                                                : "bg-red-500 hover:bg-red-600"
                                            }`}>
                                        <Trash2 className='w-5 h-5' />
                                        Delete user

                                    </button>



                                    <button
                                        onClick={() => promoteToAdmin(user._id)}
                                        disabled={user.role !== "user"}
                                        className={`flex items-center gap-2 px-4 py-2
        rounded-lg font-semibold transition-all
    ${user.role === "admin"
                                                ? "bg-gray-500/40 cursor-not-allowed"
                                                : "bg-yellow-500 hover:bg-yellow-600"
                                            }`}>
                                        <Shield className='w-5 h-5' />
                                        {user.role === "admin" ? "Admin" : "Promote to admin"}

                                    </button>



                                    <button
                                        onClick={() => demoteToUser(user._id)}
                                        disabled={user.role !== "admin"}
                                        className={`flex items-center gap-2 px-4 py-2
        rounded-lg font-semibold transition-all
    ${user.role === "admin"
                                                ? "bg-gray-500/40 cursor-not-allowed"
                                                : "bg-indigo-500 hover:bg-indigo-600"
                                            }`}>
                                        <User className='w-5 h-5' />
                                        Revert to user

                                    </button>

                                </div>
                            ))

                            }
                        </div>
                    )
                }
            </div>
        </section>
    )
}

export default Users;