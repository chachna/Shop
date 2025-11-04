// pages/admin/index.js
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Admin() {
  const [name,setName] = useState('');
  const [desc,setDesc] = useState('');
  const [price,setPrice] = useState('');
  const [file,setFile] = useState(null);
  const [msg,setMsg] = useState('');

  async function handleSubmit(e){
    e.preventDefault();
    let image_path = null;
    if (file) {
      const fileName = `${Date.now()}_${file.name}`;
      const { data: upload, error: uploadErr } = await supabase.storage
        .from('products')
        .upload(fileName, file);
      if (uploadErr) { setMsg('Upload erreur: ' + uploadErr.message); return; }
      image_path = fileName;
    }

    const { error } = await supabase.from('products').insert({
      name, description: desc, price, image_path
    });

    if (error) setMsg('Erreur: ' + error.message);
    else { setMsg('Produit ajouté'); setName(''); setDesc(''); setPrice(''); setFile(null); }
  }

  return (
    <main style={{padding:20}}>
      <h1>Admin - Ajouter produit</h1>
      <form onSubmit={handleSubmit}>
        <div><input value={name} onChange={e=>setName(e.target.value)} placeholder="Nom" required /></div>
        <div><textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" /></div>
        <div><input value={price} onChange={e=>setPrice(e.target.value)} placeholder="Prix" required /></div>
        <div><input type="file" onChange={e=>setFile(e.target.files[0])} /></div>
        <button type="submit">Ajouter</button>
      </form>
      <p>{msg}</p>
    </main>
  );
}
