import { supabase } from '../config/supabaseClient.js';
import 'dotenv/config';

export const getSemuaDesa = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('desa')
      .select('kode_desa, nama_desa, id_kecamatan, luas, jumlah_penduduk')
      .order('nama_desa', { ascending: true });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    console.error('Error getSemuaDesa:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getDesaByKecamatan = async (req, res) => {
  try {
    const { id_kecamatan } = req.params;

    // Ambil semua desa dalam kecamatan
    const { data: desaData, error: desaError } = await supabase
      .from('desa')
      .select('nama_desa, luas, jumlah_penduduk, geom')
      .eq('id_kecamatan', id_kecamatan);

    if (desaError) throw desaError;
    if (!desaData || desaData.length === 0) {
      return res.status(404).json({ success: false, message: 'Desa tidak ditemukan' });
    }

    // Ambil risiko desa yang diketahui saja
    const desaNames = desaData.map(d => d.nama_desa);

    const { data: risikoData, error: risikoError } = await supabase
      .from('risiko_banjir')
      .select('nama_desa, kategori, rata_tinggi_air, jumlah_laporan')
      .in('nama_desa', desaNames);

    if (risikoError) throw risikoError;

    // Gabungkan ke data desa
    const gabungData = desaData.map((desa) => {
      const risiko = risikoData?.find(r => r.nama_desa === desa.nama_desa);

      return {
        ...desa,
        kategori_risiko: risiko ? risiko.kategori : 'Belum ada data',
        rata_tinggi_air: risiko ? risiko.rata_tinggi_air : 'Belum ada data',
        jumlah_laporan: risiko ? risiko.jumlah_laporan : 0,
      };
    });

    // Format ke GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: gabungData.map((desa) => ({
        type: 'Feature',
        properties: {
          nama_desa: desa.nama_desa,
          luas: desa.luas,
          jumlah_penduduk: desa.jumlah_penduduk,
          kategori_risiko: desa.kategori_risiko,
          rata_tinggi_air: desa.rata_tinggi_air,
          jumlah_laporan: desa.jumlah_laporan,
        },
        geometry: desa.geom,
      })),
    };

    res.json({ success: true, data: geojson });

  } catch (err) {
    console.error('Error getDesaByKecamatan:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};



export const getDesaByKode = async (req, res) => {
  try {
    const { kode_desa } = req.params;

    const { data, error } = await supabase
      .from('desa')
      .select('kode_desa, nama_desa, id_kecamatan, luas, geom,jumlah_penduduk')
      .eq('kode_desa', kode_desa)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Desa tidak ditemukan' });

    // Format GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            kode_desa: data.kode_desa,
            nama_desa: data.nama_desa,
            luas: data.luas,
            jumlah_penduduk: data.jumlah_penduduk,
            id_kecamatan: data.id_kecamatan,
          },
          geometry: data.geom,
        },
      ],
    };

    res.json({ success: true, data: geojson });
  } catch (err) {
    console.error('Error getDesaByKode:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};


// ADMIN
export const tambahDesa = async (req, res) => {
  try {
    const { kode_desa, nama_desa, id_kecamatan, luas, jumlah_penduduk, geom } = req.body;

    if (!geom) {
      return res.status(400).json({ success: false, message: "Geom wajib diisi (GeoJSON)" });
    }

    const { data, error } = await supabase
      .from("desa")
      .insert([
        {
          kode_desa,
          nama_desa,
          id_kecamatan,
          luas,
          jumlah_penduduk,
          geom
        }
      ])
      .select();

    if (error) throw error;

    res.json({ success: true, message: "Desa berhasil ditambahkan", data });

  } catch (err) {
    console.error("Error tambahDesa:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateDesa = async (req, res) => {
  try {
    const { kode_desa } = req.params;
    const { nama_desa, id_kecamatan, luas, jumlah_penduduk, geom } = req.body;

    const updateFields = {
      ...(nama_desa !== undefined && { nama_desa }),
      ...(id_kecamatan !== undefined && { id_kecamatan }),
      ...(luas !== undefined && { luas }),
      ...(jumlah_penduduk !== undefined && { jumlah_penduduk }),
      ...(geom !== undefined && { geom }),
    };

    const { data, error } = await supabase
      .from("desa")
      .update(updateFields)
      .eq("kode_desa", kode_desa)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: "Desa tidak ditemukan" });
    }

    res.json({ success: true, message: "Desa berhasil diperbarui", data });

  } catch (err) {
    console.error("Error updateDesa:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteDesa = async (req, res) => {
  try {
    const { kode_desa } = req.params;
    const { data, error } = await supabase
      .from('desa')
      .delete()
      .eq('kode_desa', kode_desa);

    if (error) throw error;
    res.json({ success: true, message: 'Desa berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
