const data = [
  {user: {id: '57713361-3e96-4a08-a20f-80126c29a7f7'}},
  {user: {id: '901eedce-cc12-4734-9e99-4ab05af8c4eb'}},
];

console.log(
  data.some(item => item.user.id === '57713361-3e6-4a08-a20f-80126c29a7f7'),
);
