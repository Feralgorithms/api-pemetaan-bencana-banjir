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

import { supabase } from '../config/supabaseClient.js';
import 'dotenv/config';


// ADMIN
export const tambahKecamatan = async (req, res) => {
  try {
    const { kode_kec, nama_kecamatan, luas, geom } = req.body;

    const { data, error } = await supabase
      .from('kecamatan')
      .insert([
        {
          kode_kec,
          nama_kecamatan,
          luas,
          geom
        }
      ])
      .select()
      .single();

    if (error) throw error;

    res.json({ success: true, message: "Kecamatan berhasil ditambahkan", data });

  } catch (err) {
    console.error("Error tambahKecamatan:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};


export const updateKecamatan = async (req, res) => {
  try {
    const { id } = req.params;
    const { kode_kec, nama_kecamatan, luas, geom } = req.body;

    const { data, error } = await supabase
      .from('kecamatan')
      .update({
        ...(kode_kec !== undefined && { kode_kec }),
        ...(nama_kecamatan !== undefined && { nama_kecamatan }),
        ...(luas !== undefined && { luas }),
        ...(geom !== undefined && { geom }),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ success: false, message: "Kecamatan tidak ditemukan" });

    res.json({
      success: true,
      message: "Data kecamatan berhasil diperbarui",
      data
    });

  } catch (err) {
    console.error("Error updateKecamatan:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
