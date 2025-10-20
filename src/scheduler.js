import pool from "./config/supabaseClient.js";

async function updateKadaluarsa() {
  try {
    const query = `
      UPDATE laporan_banjir
      SET status = 'kadaluarsa'
      WHERE status = 'aktif'
      AND (NOW() - created_at) > INTERVAL '5 hours';
    `;
    await pool.query(query);
    console.log("Status laporan kadaluarsa diperbarui otomatis ✅");
  } catch (err) {
    console.error("Gagal memperbarui status:", err.message);
  }
}

// Jalan setiap 10 menit
setInterval(updateKadaluarsa, 10 * 60 * 1000);

updateKadaluarsa();
