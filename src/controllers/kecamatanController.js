import { supabase } from '../config/supabaseClient.js';
import 'dotenv/config';


export const getDaftarKecamatan = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('kecamatan')
      .select('id,kode_kec, nama_kecamatan')
      .order('nama_kecamatan', { ascending: true });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    console.error('Error getDaftarKecamatan:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getKecamatanById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('kecamatan')
      .select('kode_kec, nama_kecamatan, luas, geom')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: 'Kecamatan tidak ditemukan' });

    // Format GeoJSON untuk Leaflet
    const geojson = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            kode_kec: data.kode_kec,
            nama_kecamatan: data.nama_kecamatan,
            luas: data.luas,
          },
          geometry: data.geom,
        },
      ],
    };

    res.json({ success: true, data: geojson });
  } catch (err) {
    console.error('Error getKecamatanByKode:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
