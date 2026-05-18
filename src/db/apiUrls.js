import supabase, { supabaseUrl } from "./supabase";

export async function getUrls(user_id) {
  const { data, error } = await supabase
    .from("Urls")
    .select("*")
    .eq("user_id", user_id);

  if (error) throw error;

  return data;
}

export async function getUrl({ id, user_id }) {
  const { data, error } = await supabase
    .from("Urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) throw error;

  return data;
}

export async function getLongUrl(id) {
  const { data, error } = await supabase
    .from("Urls")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (error) throw error;

  return data;
}

export async function createUrl(
  { title, longUrl, customUrl, user_id },
  qrcode
) {
  const short_url = Math.random().toString(36).substring(2, 8);

  const fileName = `qr-${short_url}`;

  const { error: storageError } = await supabase.storage
    .from("qrs")
    .upload(fileName, qrcode);

  if (storageError) throw storageError;

  const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

  const { data, error } = await supabase
    .from("Urls")
    .insert([
      {
        title: title,
        original_url: longUrl,
        custom_url: customUrl || null,
        short_url: short_url,
        user_id: user_id,
        qr: qr,
      },
    ])
    .select();

  if (error) throw error;

  return data;
}

export async function deleteUrl(id) {
  const { data, error } = await supabase
    .from("Urls")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return data;
}