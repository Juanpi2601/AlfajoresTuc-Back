import { MercadoPagoConfig, Preference } from 'mercadopago';
const TOKEN_MP = process.env.TOKEN_MP;
const mercadopagoConfig = new MercadoPagoConfig({
  accessToken: TOKEN_MP,
});

export async function createPreference(body) {
  try {
    const preference = new Preference(mercadopagoConfig);
    const result = await preference.create({ body: body });
    return result.id;
  } catch (error) {
    console.error('Error creating preference:', error);
    throw error;
}
}      