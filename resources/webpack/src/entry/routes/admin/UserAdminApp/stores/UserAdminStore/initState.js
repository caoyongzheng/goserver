export default {
  page: 1, // 当前页码
  pagesize: 10, // 页码大小
  search: '', // 搜索内容
  users: [], // 列表用户
  total: 0, // 用户总数
  selectedUsers: [], // 选中用户
  // 新增用户弹窗
  nOpen: false, // 显示状态
  nUsername: '', // 用户名
  nPassword: '123456', // 密码
  // 删除用户弹窗
  dOpen: false,
  dUserId: '',
  dUsername: '',
  comfirmUsername: '',
}
