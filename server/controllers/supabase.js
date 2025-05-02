import { supabaseClient as supabase } from '../config/supabase-client.js';
export default {
  grabIncomingOrders: async (req, res) => {
    const organizationID = req.params.id;
    const { data } = await supabase
    .from('Orders')
    .select("id, created_at, order_status, Organizations (name, id), users(Names(name))")
    .eq('order_received_by', organizationID)
    .order('created_at', { ascending: false });
    console.log(data);
    res.send(data);
  },
  // to prove they're from the organization that their id is at matching, if not throw error
  // make an api request, get request to website/api/getIncomingOrders/:orgID
  grabTestReport: async (req, res) => {
    const orderID = req.params.id;
    const { data: orderData } = await supabase
      .from('Orders')
      .select('Organizations(*), users(*, Names(*)), Samples(*, Tests(*))')
      .eq('id', orderID)
    console.log(orderData[0]);
    res.send(orderData[0]);
  }
};