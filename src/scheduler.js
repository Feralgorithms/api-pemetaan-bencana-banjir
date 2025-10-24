import { supabase } from './config/supabaseClient.js';

async function updateKadaluarsa() {
  try {
    const { error } = await supabase
      .from('laporan_banjir')
      .update({ status: 'kadaluarsa' })
      .lt('created_at', new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString())
      .eq('status', 'aktif');

    if (error) throw error;

    console.log("Status laporan kadaluarsa diperbarui otomatis ✅");
  } catch (err) {
    console.error("Gagal memperbarui status:", err.message);
  }
}

// Jalan setiap 10 menit
setInterval(updateKadaluarsa, 10 * 60 * 1000);

updateKadaluarsa();
