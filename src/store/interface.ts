
// export enum FilterType {
//   ALL = 'all',
//   JOYO = 'joyo',
// }

interface ProjectListItem {
  uuid: number,
  name: string,
  createAt: number,
  updateAt: number,
}

export default interface State {
  projectList: ProjectListItem[]
}
