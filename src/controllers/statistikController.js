import {supabase} from "../config/supabaseClient.js";

export const getStatistikUser = async (req, res) => {
  try {
    const [laporanRes, risikoRes, kecRes, desaRes] = await Promise.all([
      supabase.from("laporan_banjir").select("id, verifikasi, tinggi_air"),
      supabase.from("risiko_banjir").select("kategori"),
      supabase.from("kecamatan").select("*", { count: "exact", head: true }),
      supabase.from("desa").select("*", { count: "exact", head: true }),
    ]);

    const laporan = laporanRes.data || [];
    const risiko = risikoRes.data || [];

    const totalLaporan = laporan.length;

    const statusCounts = {
      pending: laporan.filter(l => l.verifikasi === "pending").length,
      diterima: laporan.filter(l => l.verifikasi === "diterima").length,
      ditolak: laporan.filter(l => l.verifikasi === "ditolak").length,
    };

    const kategoriRisikoCount = {
      Rendah: risiko.filter(r => r.kategori === "Rendah").length,
      Sedang: risiko.filter(r => r.kategori === "Sedang").length,
      Tinggi: risiko.filter(r => r.kategori === "Tinggi").length,
    };

    res.status(200).json({
      success: true,
      data: {
        totalKecamatan: kecRes.count,
        totalDesa: desaRes.count,
        totalLaporan,
        statusCounts,
        kategoriRisikoCount,
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Gagal memuat statistik"
    });
  }
};
