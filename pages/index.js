// pages/index.js
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function Home({ products }) {
  return (
    <main style={{padding:20}}>
      <h1>Ma boutique prototype</h1>
      <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20}}>
        {products.map(p => (
          <div key={p.id} style={{border:'1px solid #ddd', padding:10}}>
            <img src={p.image_url || '/placeholder.png'} alt={p.name} style={{width:'100%', height:180, objectFit:'cover'}} />
            <h3>{p.name}</h3>
            <p>{p.description?.slice(0,100)}</p>
            <p>{p.price} €</p>
            <Link href={`/products/${p.id}`}><a>Voir</a></Link>
          </div>
        ))}
      </div>
      <p><Link href="/admin">Admin</Link></p>
    </main>
  );
}

export async function getServerSideProps() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const productsWithImage = (products || []).map(p => ({
    ...p,
    image_url: p.image_path ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/${p.image_path}` : null
  }));

  return { props: { products: productsWithImage } };
}
