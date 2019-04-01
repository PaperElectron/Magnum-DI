export default function dependencies() {
  let dependencies: object = {}

  return {
    get: function (prop: string) {
      return dependencies[prop] || null
    },
    set: function (prop: string, dependency) : object {
      return dependencies[prop] = dependency
    },
    getAll: function () : object {
      return dependencies
    },
    remove: function (prop: string) {
     return delete dependencies[prop]
    }
  }
}