"use client";
import Image from "next/image";
import React, {useState, useEffect} from 'react';
import { collection, addDoc, getDoc, querySnapshot, query, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import {db} from './firebase'

export default function Home() {
  const [items, setItems] = useState([
    // {name:'donut', price: 3},
    // {name:'Pineapple', price: 4},
    // {name:'Rice', price: 2}
  ]);
  const[newItem, setNewItem] = useState({name: '', quantity: 1, exp_date:''})

  // add item to database
  const addItem = async (e) => {
    e.preventDefault()
    if(newItem.name !== '' && newItem.exp_date !== ''){
      //setItems([...items,newItem]);
      await addDoc(collection(db, "items"), {
      name: newItem.name.trim(),
      exp_date: newItem.exp_date,
      quantity: newItem.quantity,
    })
    setNewItem({name:'', quantity: 1, exp_date:''})
    }
  }

  //read items from database
  useEffect(() => {
    const q = query(collection(db, "items"), orderBy("exp_date"))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = []

      querySnapshot.forEach((doc) => {
        itemsArr.push({...doc.data(), id:doc.id})
      })
      setItems(itemsArr)
      })
    }, [])

  //delete items from database
  const deleteItem = async(id) => {
    const docRef = doc(db, "items", id)
    const docSnap = await getDoc(docRef)

    const currentData = docSnap.data()
    const newQuantity = currentData.quantity - 1
    if(newQuantity == '0'){
      await deleteDoc(doc(db, "items", id))
    } else {
      await updateDoc(docRef, {
        quantity: newQuantity
      })
    }
  }

  //increasing quantity
  const additionalItem = async(id) =>{
    const docRef = doc(db, "items", id) //first make a reference
    const docSnap = await getDoc(docRef) //get a snapshot of the

    const currentData = docSnap.data()
    const newQuantity = currentData.quantity + 1
    await updateDoc(docRef, {
      quantity: newQuantity
    })
  }

 //check for expiring items



  return (
    <main className="flex min-h-screen flex-col items-center justify-between sm:p-24 p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className='text-4xl p-4 text-center'>Pantry Tracker</h1>
        <div className="bg-slate-800 p-4 rounded-lg">
          <form className="grid grid-cols-6 items-center text-black">
            <input 
              value={newItem.name} 
              onChange={(e) => setNewItem({ ...newItem, name:e.target.value })} 
              className="col-span-3 p-3 border" 
              type="text" 
              placeholder='Enter Item' />
            <input 
              value={newItem.exp_date} 
              onChange={(e) => setNewItem({...newItem, exp_date:e.target.value})}
              className="col-span-2 p-3 border mx-3" 
              type="text" 
              placeholder='Enter Exp. Date' />
            <button 
              onClick={addItem}
              className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl" 
              type="submit">+</button>
          </form>
          <ul>
            {items.map((item, id) => (
              <li key={id} className="my-4 w-full flex justify-between bg-slate-950">
                <div className="p-4 w-full flex justify-between">
                  <span className='capitalize'>{item.name}</span>
                  <span>{item.quantity}</span>
                </div>
                <button onClick={() => additionalItem(item.id)} className="ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16">+</button>
                <button onClick={() => deleteItem(item.id)} className="p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16">X</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
