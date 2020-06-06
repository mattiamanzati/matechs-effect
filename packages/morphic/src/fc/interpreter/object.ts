import { record } from "fast-check"

import type { InterfaceA } from "../../config"
import { memo, projectFieldWithEnv } from "../../utils"
import { fcApplyConfig } from "../config"
import { FastCheckType, FastCheckURI } from "../hkt"

import { introduce } from "@matechs/core/Function"
import type { AnyEnv } from "@matechs/morphic-alg/config"
import type { MatechsAlgebraObject1 } from "@matechs/morphic-alg/object"

declare module "@matechs/morphic-alg/object" {
  interface InterfaceConfig<Props> {
    [FastCheckURI]: {
      arbs: InterfaceA<Props, FastCheckURI>
    }
  }
  interface PartialConfig<Props> {
    [FastCheckURI]: {
      arbs: InterfaceA<Props, FastCheckURI>
    }
  }
}

export const fcObjectInterpreter = memo(
  <Env extends AnyEnv>(): MatechsAlgebraObject1<FastCheckURI, Env> => ({
    _F: FastCheckURI,
    partial: (props, _name, config) => (env) =>
      introduce(projectFieldWithEnv(props, env)("arb"))(
        (arbs) =>
          new FastCheckType(
            fcApplyConfig(config)(
              record(arbs, {
                withDeletedKeys: true
              }) as any,
              env,
              {
                arbs: arbs as any
              }
            )
          )
      ),
    interface: (props, _name, config) => (env) =>
      introduce(projectFieldWithEnv(props, env)("arb"))(
        (arbs) =>
          new FastCheckType(
            fcApplyConfig(config)(record(arbs), env, {
              arbs: arbs as any
            })
          )
      )
  })
)