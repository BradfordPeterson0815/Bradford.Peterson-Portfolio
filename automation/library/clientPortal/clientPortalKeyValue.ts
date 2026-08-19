export class KeyValue {
  key: string
  value: string | number
  constructor(key = '', value = '') {
    this.key = key
    this.value = value
  }
}
