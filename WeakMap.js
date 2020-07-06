/**
 * weakMap 문자열을 제외한 다른 객체를 키로 씀
 * Object
 * - object
 *   => Object.create(null)
 *   => object[key]
 *   => object[key]
 *   => delete object[key]
 *
 * - weakMap
 *   => weakmap = new WeakMap();
 *   => weakmap.get(key)
 *   => weakmap.set(keym, value);
 *   => weakmap.delete(key);
 */

// sample1
const secret_key = new WeakMap();
secret_key.set(object, secret);
secret = secret_key.get(object);

function sealer_factory() {
  const weakmap = new WeakMap();
  return {
    selaer(object) {
      const box = Object.freeze(Object.create(null));
      weakmap.set(box, object());
      return box;
    },
    unselaer(box) {
      return weakMap.get(box);
    },
  };
}
