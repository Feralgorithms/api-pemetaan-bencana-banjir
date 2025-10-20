import { supabase } from '../config/supabaseClient.js';
import 'dotenv/config'; 


export const tambahLaporan = async (req, res) => {
  try {
    const bucketName = process.env.SUPABASE_BUCKET; 
    if (!bucketName) throw new Error('SUPABASE_BUCKET belum diatur di environment');

    const { latitude, longitude, tinggi_air, deskripsi, gambar_base64, nama_file } = req.body;

    //  Upload gambar ke Supabase Storage
    const imageBuffer = Buffer.from(gambar_base64, 'base64');

    const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(`images/${Date.now()}-${nama_file}`, imageBuffer, {
      contentType: 'image/jpeg',
    });

    if (uploadError) throw uploadError;

    // Dapatkan public URL
    const { data: publicUrl } = supabase.storage
      .from(bucketName)
      .getPublicUrl(uploadData.path);

    // Simpan data laporan ke database Supabase
    const { data, error } = await supabase
      .from('laporan_banjir')
      .insert([
        {
          latitude,
          longitude,
          tinggi_air,
          deskripsi,
          foto_url: publicUrl.publicUrl,
        },
      ])
      .select();

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getLaporan = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('laporan_banjir')
      .select('*')
      .eq('status', 'aktif') // hanya ambil laporan yang masih aktif
      .order('id', { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
