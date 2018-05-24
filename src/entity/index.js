import { Vector3, MeshBuilder } from '../babylon';
import * as AbstractEntity from '../entity/abstract';
import { vec3, toVec3 } from '../types/vector';

const { validator } = vec3;

export const mixins = [AbstractEntity];

export const props = {
  position: vec3,
  rotation: vec3,
  scaling: {
    validator,
    default: () => Vector3.One(),
  },
};

export const computed = {
  _$_positionVector3() {
    return toVec3(this.position);
  },

  _$_rotationVector3() {
    return toVec3(this.rotation);
  },

  _$_scalingVector3() {
    return toVec3(this.scaling);
  },
};

export const watch = {
  _$_positionVector3() {
    this._$_setPosition();
  },

  _$_rotationVector3() {
    this._$_setRotation();
  },

  _$_scalingVector3() {
    this._$_setScaling();
  },
};

export const methods = {
  _$_setPosition() {
    if (this.$entity && this.$entity.position) {
      this.$entity.position.copyFrom(this._$_positionVector3);
    }
  },

  _$_setRotation() {
    if (this.$entity && this.$entity.rotation) {
      this.$entity.rotation.copyFrom(this._$_rotationVector3);
    }
  },

  _$_setScaling() {
    if (this.$entity && this.$entity.scaling) {
      this.$entity.scaling.copyFrom(this._$_scalingVector3);
    }
  },
};

export const created = function () {
  Object.assign(this._$_hookArgs, {
    position: this._$_positionVector3,
    rotation: this._$_rotationVector3,
    scaling: this._$_scalingVector3,
  });
};

/* eslint-disable camelcase */
export const _$_onTransform = function () {
  if (!this.$entity) {
    // HACK: TransformNode does not implement IPhysicsEnabledObject, so using invisible box instead
    let box = MeshBuilder.CreateBox(this.name, {}, this.$scene);
    box.isVisible = false;
    this.$entity = box;
  }
  this._$_setPosition();
  this._$_setRotation();
  this._$_setScaling();
  if (!this.$entity.parent) {
    this.$entity.parent = this._$_parent;
  }
};