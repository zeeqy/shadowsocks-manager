const knex = appRequire('init/knex').knex;
const moment = require('moment');

const newOrderId = () => {
  return moment().format('YYYYMMDDHHmmss') + Math.random().toString().substr(2, 6);
};

const newOrder = async data => {
  await knex('webgui_ref_time').insert({
    orderId: newOrderId(),
    user: data.user,
    refUser: data.refUser,
    account: data.account,
    refTime: data.refTime,
    status: 'FINISH',
    createTime: Date.now(),
  });
  return;
};

const getUserOrders = async userId => {
  const orders = await knex('webgui_ref_time').select([
    'webgui_ref_time.orderId',
    'user.id as userId',
    'user.group as group',
    'user.username',
    'account_plugin.port',
    'webgui_ref_time.refTime',
    'webgui_ref_time.status',
    'webgui_ref_time.createTime',
  ])
  .leftJoin('user', 'user.id', 'webgui_ref_time.user')
  .leftJoin('account_plugin', 'account_plugin.id', 'webgui_ref_time.account')
  .where({ 'user.id': userId });
  return orders;
};

const orderListAndPaging = async (options = {}) => {
  const search = options.search || '';
  const group = options.group;
  const filter = options.filter || [];
  const sort = options.sort || 'webgui_ref_time.createTime_desc';
  const page = options.page || 1;
  const pageSize = options.pageSize || 20;

  let count = knex('webgui_ref_time').select();
  let orders = knex('webgui_ref_time').select([
    'webgui_ref_time.orderId',
    'user.id as userId',
    'user.group as group',
    'user.username',
    'account_plugin.port',
    'webgui_ref_time.refTime',
    'webgui_ref_time.status',
    'webgui_ref_time.createTime',
  ])
  .leftJoin('user', 'user.id', 'webgui_ref_time.user')
  .leftJoin('account_plugin', 'account_plugin.id', 'webgui_ref_time.account');

  if(filter.length) {
    count = count.whereIn('webgui_ref_time.status', filter);
    orders = orders.whereIn('webgui_ref_time.status', filter);
  }
  if(group >= 0) {
    count = count.leftJoin('user', 'user.id', 'webgui_ref_time.user').where({ 'user.group': group });
    orders = orders.where({ 'user.group': group });
  }
  if(search) {
    count = count.where('webgui_ref_time.orderId', 'like', `%${ search }%`);
    orders = orders.where('webgui_ref_time.orderId', 'like', `%${ search }%`);
  }

  count = await count.count('orderId as count').then(success => success[0].count);
  orders = await orders.orderBy(
    sort.split('_').slice(0, sort.split('_').length - 1).join('_'),
    sort.split('_')[sort.split('_').length - 1]
  ).limit(pageSize).offset((page - 1) * pageSize);
  const maxPage = Math.ceil(count / pageSize);
  return {
    total: count,
    page,
    maxPage,
    pageSize,
    orders,
  };
};

exports.newOrder = newOrder;
exports.getUserOrders = getUserOrders;
exports.orderListAndPaging = orderListAndPaging;