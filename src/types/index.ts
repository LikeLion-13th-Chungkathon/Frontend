// user.types.ts 파일의 모든 타입을 가져와서 그대로 다시 내보내기
export * from "./user.types";

// api.types.ts 파일의 모든 타입을 가져와서 그대로 다시 내보내기
export * from "./api.types";

// note.types.ts 파일의 모든 타입을 가져와서 그대로 다시 내보내기
export * from "./note.types";

// event.types.ts 파일의 모든 타입을 가져와서 그대로 다시 내보내기
export * from "./event.types";

// 이렇게 안 해도 되고
// import { User } from '../types/user.types';
// import { Post } from '../types/post.types';

// 이렇게 깔끔하게 가져올 수 있습니다.
// import { User, Post } from '../types';
