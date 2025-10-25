import { supabase } from '../config/supabaseClient.js';
import 'dotenv/config';

export const getSemuaDesa = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('desa')
      .select('kode_desa, nama_desa, id_kecamatan, luas')
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
      .select('kode_desa, nama_desa, id_kecamatan, luas, geom')
      .eq('id_kecamatan', id_kecamatan);

    if (desaError) throw desaError;
    if (!desaData || desaData.length === 0) {
      return res.status(404).json({ success: false, message: 'Desa tidak ditemukan' });
    }

    // Ambil data risiko dari tabel risiko_banjir
    const { data: risikoData, error: risikoError } = await supabase
      .from('risiko_banjir')
      .select('nama_desa, kategori');

    if (risikoError) throw risikoError;

    // Gabungkan data risiko ke dalam desa
    const gabungData = desaData.map(desa => {
      const risiko = risikoData.find(r => r.nama_desa === desa.nama_desa);
      return {
        ...desa,
        kategori_risiko: risiko ? risiko.kategori : 'Belum Ada Data'
      };
    });

    // Format jadi GeoJSON
    const geojson = {
      type: 'FeatureCollection',
      features: gabungData.map((desa) => ({
        type: 'Feature',
        properties: {
          kode_desa: desa.kode_desa,
          nama_desa: desa.nama_desa,
          luas: desa.luas,
          id_kecamatan: desa.id_kecamatan,
          kategori_risiko: desa.kategori_risiko
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
      .select('kode_desa, nama_desa, id_kecamatan, luas, geom')
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
