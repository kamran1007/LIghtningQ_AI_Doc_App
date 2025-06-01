
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Organization
 * 
 */
export type Organization = $Result.DefaultSelection<Prisma.$OrganizationPayload>
/**
 * Model Hospital
 * 
 */
export type Hospital = $Result.DefaultSelection<Prisma.$HospitalPayload>
/**
 * Model UserHospitalAccess
 * 
 */
export type UserHospitalAccess = $Result.DefaultSelection<Prisma.$UserHospitalAccessPayload>
/**
 * Model Setting
 * 
 */
export type Setting = $Result.DefaultSelection<Prisma.$SettingPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model LoginSession
 * 
 */
export type LoginSession = $Result.DefaultSelection<Prisma.$LoginSessionPayload>
/**
 * Model Role
 * 
 */
export type Role = $Result.DefaultSelection<Prisma.$RolePayload>
/**
 * Model RolePermission
 * 
 */
export type RolePermission = $Result.DefaultSelection<Prisma.$RolePermissionPayload>
/**
 * Model Permission
 * 
 */
export type Permission = $Result.DefaultSelection<Prisma.$PermissionPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const HospitalLevel: {
  SUPER: 'SUPER',
  CHILD: 'CHILD',
  SUB_CHILD: 'SUB_CHILD'
};

export type HospitalLevel = (typeof HospitalLevel)[keyof typeof HospitalLevel]


export const Title: {
  Mr: 'Mr',
  Mrs: 'Mrs',
  Miss: 'Miss',
  Ms: 'Ms',
  Dr: 'Dr',
  Prof: 'Prof',
  Other: 'Other'
};

export type Title = (typeof Title)[keyof typeof Title]


export const Hospital_Org_status: {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED'
};

export type Hospital_Org_status = (typeof Hospital_Org_status)[keyof typeof Hospital_Org_status]


export const SpecializationType: {
  GENERAL: 'GENERAL',
  OPHTHALMOLOGY: 'OPHTHALMOLOGY',
  DENTAL: 'DENTAL',
  ENT: 'ENT',
  ORTHOPEDIC: 'ORTHOPEDIC',
  MULTISPECIALITY: 'MULTISPECIALITY',
  OTHER: 'OTHER'
};

export type SpecializationType = (typeof SpecializationType)[keyof typeof SpecializationType]


export const OrganizationType: {
  HOSPITAL: 'HOSPITAL',
  CLINIC: 'CLINIC',
  DIAGNOSTICS: 'DIAGNOSTICS'
};

export type OrganizationType = (typeof OrganizationType)[keyof typeof OrganizationType]

}

export type HospitalLevel = $Enums.HospitalLevel

export const HospitalLevel: typeof $Enums.HospitalLevel

export type Title = $Enums.Title

export const Title: typeof $Enums.Title

export type Hospital_Org_status = $Enums.Hospital_Org_status

export const Hospital_Org_status: typeof $Enums.Hospital_Org_status

export type SpecializationType = $Enums.SpecializationType

export const SpecializationType: typeof $Enums.SpecializationType

export type OrganizationType = $Enums.OrganizationType

export const OrganizationType: typeof $Enums.OrganizationType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.organization`: Exposes CRUD operations for the **Organization** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Organizations
    * const organizations = await prisma.organization.findMany()
    * ```
    */
  get organization(): Prisma.OrganizationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.hospital`: Exposes CRUD operations for the **Hospital** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Hospitals
    * const hospitals = await prisma.hospital.findMany()
    * ```
    */
  get hospital(): Prisma.HospitalDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userHospitalAccess`: Exposes CRUD operations for the **UserHospitalAccess** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserHospitalAccesses
    * const userHospitalAccesses = await prisma.userHospitalAccess.findMany()
    * ```
    */
  get userHospitalAccess(): Prisma.UserHospitalAccessDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.setting`: Exposes CRUD operations for the **Setting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Settings
    * const settings = await prisma.setting.findMany()
    * ```
    */
  get setting(): Prisma.SettingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.loginSession`: Exposes CRUD operations for the **LoginSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LoginSessions
    * const loginSessions = await prisma.loginSession.findMany()
    * ```
    */
  get loginSession(): Prisma.LoginSessionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.role`: Exposes CRUD operations for the **Role** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Roles
    * const roles = await prisma.role.findMany()
    * ```
    */
  get role(): Prisma.RoleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.rolePermission`: Exposes CRUD operations for the **RolePermission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more RolePermissions
    * const rolePermissions = await prisma.rolePermission.findMany()
    * ```
    */
  get rolePermission(): Prisma.RolePermissionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.permission`: Exposes CRUD operations for the **Permission** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Permissions
    * const permissions = await prisma.permission.findMany()
    * ```
    */
  get permission(): Prisma.PermissionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.8.0
   * Query Engine version: 2060c79ba17c6bb9f5823312b6f6b7f4a845738e
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Organization: 'Organization',
    Hospital: 'Hospital',
    UserHospitalAccess: 'UserHospitalAccess',
    Setting: 'Setting',
    AuditLog: 'AuditLog',
    LoginSession: 'LoginSession',
    Role: 'Role',
    RolePermission: 'RolePermission',
    Permission: 'Permission'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "organization" | "hospital" | "userHospitalAccess" | "setting" | "auditLog" | "loginSession" | "role" | "rolePermission" | "permission"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Organization: {
        payload: Prisma.$OrganizationPayload<ExtArgs>
        fields: Prisma.OrganizationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OrganizationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OrganizationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          findFirst: {
            args: Prisma.OrganizationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OrganizationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          findMany: {
            args: Prisma.OrganizationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          create: {
            args: Prisma.OrganizationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          createMany: {
            args: Prisma.OrganizationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.OrganizationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          delete: {
            args: Prisma.OrganizationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          update: {
            args: Prisma.OrganizationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          deleteMany: {
            args: Prisma.OrganizationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OrganizationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.OrganizationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>[]
          }
          upsert: {
            args: Prisma.OrganizationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OrganizationPayload>
          }
          aggregate: {
            args: Prisma.OrganizationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOrganization>
          }
          groupBy: {
            args: Prisma.OrganizationGroupByArgs<ExtArgs>
            result: $Utils.Optional<OrganizationGroupByOutputType>[]
          }
          count: {
            args: Prisma.OrganizationCountArgs<ExtArgs>
            result: $Utils.Optional<OrganizationCountAggregateOutputType> | number
          }
        }
      }
      Hospital: {
        payload: Prisma.$HospitalPayload<ExtArgs>
        fields: Prisma.HospitalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.HospitalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.HospitalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload>
          }
          findFirst: {
            args: Prisma.HospitalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.HospitalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload>
          }
          findMany: {
            args: Prisma.HospitalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload>[]
          }
          create: {
            args: Prisma.HospitalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload>
          }
          createMany: {
            args: Prisma.HospitalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.HospitalCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload>[]
          }
          delete: {
            args: Prisma.HospitalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload>
          }
          update: {
            args: Prisma.HospitalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload>
          }
          deleteMany: {
            args: Prisma.HospitalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.HospitalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.HospitalUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload>[]
          }
          upsert: {
            args: Prisma.HospitalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$HospitalPayload>
          }
          aggregate: {
            args: Prisma.HospitalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateHospital>
          }
          groupBy: {
            args: Prisma.HospitalGroupByArgs<ExtArgs>
            result: $Utils.Optional<HospitalGroupByOutputType>[]
          }
          count: {
            args: Prisma.HospitalCountArgs<ExtArgs>
            result: $Utils.Optional<HospitalCountAggregateOutputType> | number
          }
        }
      }
      UserHospitalAccess: {
        payload: Prisma.$UserHospitalAccessPayload<ExtArgs>
        fields: Prisma.UserHospitalAccessFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserHospitalAccessFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserHospitalAccessPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserHospitalAccessFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserHospitalAccessPayload>
          }
          findFirst: {
            args: Prisma.UserHospitalAccessFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserHospitalAccessPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserHospitalAccessFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserHospitalAccessPayload>
          }
          findMany: {
            args: Prisma.UserHospitalAccessFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserHospitalAccessPayload>[]
          }
          create: {
            args: Prisma.UserHospitalAccessCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserHospitalAccessPayload>
          }
          createMany: {
            args: Prisma.UserHospitalAccessCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserHospitalAccessCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserHospitalAccessPayload>[]
          }
          delete: {
            args: Prisma.UserHospitalAccessDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserHospitalAccessPayload>
          }
          update: {
            args: Prisma.UserHospitalAccessUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserHospitalAccessPayload>
          }
          deleteMany: {
            args: Prisma.UserHospitalAccessDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserHospitalAccessUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserHospitalAccessUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserHospitalAccessPayload>[]
          }
          upsert: {
            args: Prisma.UserHospitalAccessUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserHospitalAccessPayload>
          }
          aggregate: {
            args: Prisma.UserHospitalAccessAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserHospitalAccess>
          }
          groupBy: {
            args: Prisma.UserHospitalAccessGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserHospitalAccessGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserHospitalAccessCountArgs<ExtArgs>
            result: $Utils.Optional<UserHospitalAccessCountAggregateOutputType> | number
          }
        }
      }
      Setting: {
        payload: Prisma.$SettingPayload<ExtArgs>
        fields: Prisma.SettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          findFirst: {
            args: Prisma.SettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          findMany: {
            args: Prisma.SettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>[]
          }
          create: {
            args: Prisma.SettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          createMany: {
            args: Prisma.SettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SettingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>[]
          }
          delete: {
            args: Prisma.SettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          update: {
            args: Prisma.SettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          deleteMany: {
            args: Prisma.SettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SettingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>[]
          }
          upsert: {
            args: Prisma.SettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SettingPayload>
          }
          aggregate: {
            args: Prisma.SettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSetting>
          }
          groupBy: {
            args: Prisma.SettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<SettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.SettingCountArgs<ExtArgs>
            result: $Utils.Optional<SettingCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      LoginSession: {
        payload: Prisma.$LoginSessionPayload<ExtArgs>
        fields: Prisma.LoginSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LoginSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LoginSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginSessionPayload>
          }
          findFirst: {
            args: Prisma.LoginSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LoginSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginSessionPayload>
          }
          findMany: {
            args: Prisma.LoginSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginSessionPayload>[]
          }
          create: {
            args: Prisma.LoginSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginSessionPayload>
          }
          createMany: {
            args: Prisma.LoginSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LoginSessionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginSessionPayload>[]
          }
          delete: {
            args: Prisma.LoginSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginSessionPayload>
          }
          update: {
            args: Prisma.LoginSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginSessionPayload>
          }
          deleteMany: {
            args: Prisma.LoginSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LoginSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LoginSessionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginSessionPayload>[]
          }
          upsert: {
            args: Prisma.LoginSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LoginSessionPayload>
          }
          aggregate: {
            args: Prisma.LoginSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLoginSession>
          }
          groupBy: {
            args: Prisma.LoginSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<LoginSessionGroupByOutputType>[]
          }
          count: {
            args: Prisma.LoginSessionCountArgs<ExtArgs>
            result: $Utils.Optional<LoginSessionCountAggregateOutputType> | number
          }
        }
      }
      Role: {
        payload: Prisma.$RolePayload<ExtArgs>
        fields: Prisma.RoleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RoleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RoleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findFirst: {
            args: Prisma.RoleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RoleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          findMany: {
            args: Prisma.RoleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          create: {
            args: Prisma.RoleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          createMany: {
            args: Prisma.RoleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RoleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          delete: {
            args: Prisma.RoleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          update: {
            args: Prisma.RoleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          deleteMany: {
            args: Prisma.RoleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RoleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RoleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>[]
          }
          upsert: {
            args: Prisma.RoleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePayload>
          }
          aggregate: {
            args: Prisma.RoleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRole>
          }
          groupBy: {
            args: Prisma.RoleGroupByArgs<ExtArgs>
            result: $Utils.Optional<RoleGroupByOutputType>[]
          }
          count: {
            args: Prisma.RoleCountArgs<ExtArgs>
            result: $Utils.Optional<RoleCountAggregateOutputType> | number
          }
        }
      }
      RolePermission: {
        payload: Prisma.$RolePermissionPayload<ExtArgs>
        fields: Prisma.RolePermissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.RolePermissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.RolePermissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          findFirst: {
            args: Prisma.RolePermissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.RolePermissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          findMany: {
            args: Prisma.RolePermissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>[]
          }
          create: {
            args: Prisma.RolePermissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          createMany: {
            args: Prisma.RolePermissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.RolePermissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>[]
          }
          delete: {
            args: Prisma.RolePermissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          update: {
            args: Prisma.RolePermissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          deleteMany: {
            args: Prisma.RolePermissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.RolePermissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.RolePermissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>[]
          }
          upsert: {
            args: Prisma.RolePermissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$RolePermissionPayload>
          }
          aggregate: {
            args: Prisma.RolePermissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateRolePermission>
          }
          groupBy: {
            args: Prisma.RolePermissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<RolePermissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.RolePermissionCountArgs<ExtArgs>
            result: $Utils.Optional<RolePermissionCountAggregateOutputType> | number
          }
        }
      }
      Permission: {
        payload: Prisma.$PermissionPayload<ExtArgs>
        fields: Prisma.PermissionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PermissionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PermissionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          findFirst: {
            args: Prisma.PermissionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PermissionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          findMany: {
            args: Prisma.PermissionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          create: {
            args: Prisma.PermissionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          createMany: {
            args: Prisma.PermissionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PermissionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          delete: {
            args: Prisma.PermissionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          update: {
            args: Prisma.PermissionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          deleteMany: {
            args: Prisma.PermissionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PermissionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PermissionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>[]
          }
          upsert: {
            args: Prisma.PermissionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PermissionPayload>
          }
          aggregate: {
            args: Prisma.PermissionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePermission>
          }
          groupBy: {
            args: Prisma.PermissionGroupByArgs<ExtArgs>
            result: $Utils.Optional<PermissionGroupByOutputType>[]
          }
          count: {
            args: Prisma.PermissionCountArgs<ExtArgs>
            result: $Utils.Optional<PermissionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    organization?: OrganizationOmit
    hospital?: HospitalOmit
    userHospitalAccess?: UserHospitalAccessOmit
    setting?: SettingOmit
    auditLog?: AuditLogOmit
    loginSession?: LoginSessionOmit
    role?: RoleOmit
    rolePermission?: RolePermissionOmit
    permission?: PermissionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    auditLogs: number
    loginSessions: number
    AdminAccess: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    auditLogs?: boolean | UserCountOutputTypeCountAuditLogsArgs
    loginSessions?: boolean | UserCountOutputTypeCountLoginSessionsArgs
    AdminAccess?: boolean | UserCountOutputTypeCountAdminAccessArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAuditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLoginSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoginSessionWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAdminAccessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserHospitalAccessWhereInput
  }


  /**
   * Count Type OrganizationCountOutputType
   */

  export type OrganizationCountOutputType = {
    hospitals: number
    users: number
  }

  export type OrganizationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hospitals?: boolean | OrganizationCountOutputTypeCountHospitalsArgs
    users?: boolean | OrganizationCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OrganizationCountOutputType
     */
    select?: OrganizationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountHospitalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HospitalWhereInput
  }

  /**
   * OrganizationCountOutputType without action
   */
  export type OrganizationCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Count Type HospitalCountOutputType
   */

  export type HospitalCountOutputType = {
    childHospital: number
    users: number
  }

  export type HospitalCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    childHospital?: boolean | HospitalCountOutputTypeCountChildHospitalArgs
    users?: boolean | HospitalCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * HospitalCountOutputType without action
   */
  export type HospitalCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the HospitalCountOutputType
     */
    select?: HospitalCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * HospitalCountOutputType without action
   */
  export type HospitalCountOutputTypeCountChildHospitalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HospitalWhereInput
  }

  /**
   * HospitalCountOutputType without action
   */
  export type HospitalCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserHospitalAccessWhereInput
  }


  /**
   * Count Type RoleCountOutputType
   */

  export type RoleCountOutputType = {
    users: number
    UserHospitalAccess: number
    permissions: number
  }

  export type RoleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | RoleCountOutputTypeCountUsersArgs
    UserHospitalAccess?: boolean | RoleCountOutputTypeCountUserHospitalAccessArgs
    permissions?: boolean | RoleCountOutputTypeCountPermissionsArgs
  }

  // Custom InputTypes
  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RoleCountOutputType
     */
    select?: RoleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountUserHospitalAccessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserHospitalAccessWhereInput
  }

  /**
   * RoleCountOutputType without action
   */
  export type RoleCountOutputTypeCountPermissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolePermissionWhereInput
  }


  /**
   * Count Type PermissionCountOutputType
   */

  export type PermissionCountOutputType = {
    roles: number
  }

  export type PermissionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roles?: boolean | PermissionCountOutputTypeCountRolesArgs
  }

  // Custom InputTypes
  /**
   * PermissionCountOutputType without action
   */
  export type PermissionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PermissionCountOutputType
     */
    select?: PermissionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PermissionCountOutputType without action
   */
  export type PermissionCountOutputTypeCountRolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolePermissionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
    roleId: number | null
    organizationId: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
    roleId: number | null
    organizationId: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    title: $Enums.Title | null
    imageUrl: string | null
    firstName: string | null
    lastName: string | null
    gender: string | null
    email: string | null
    mobile: string | null
    passwordHash: string | null
    isActive: boolean | null
    hashedRefreshToken: string | null
    dateOfBirth: Date | null
    roleId: number | null
    organizationId: number | null
    deletedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    title: $Enums.Title | null
    imageUrl: string | null
    firstName: string | null
    lastName: string | null
    gender: string | null
    email: string | null
    mobile: string | null
    passwordHash: string | null
    isActive: boolean | null
    hashedRefreshToken: string | null
    dateOfBirth: Date | null
    roleId: number | null
    organizationId: number | null
    deletedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    title: number
    imageUrl: number
    firstName: number
    lastName: number
    gender: number
    email: number
    mobile: number
    passwordHash: number
    isActive: number
    hashedRefreshToken: number
    dateOfBirth: number
    roleId: number
    organizationId: number
    deletedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
    roleId?: true
    organizationId?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
    roleId?: true
    organizationId?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    title?: true
    imageUrl?: true
    firstName?: true
    lastName?: true
    gender?: true
    email?: true
    mobile?: true
    passwordHash?: true
    isActive?: true
    hashedRefreshToken?: true
    dateOfBirth?: true
    roleId?: true
    organizationId?: true
    deletedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    title?: true
    imageUrl?: true
    firstName?: true
    lastName?: true
    gender?: true
    email?: true
    mobile?: true
    passwordHash?: true
    isActive?: true
    hashedRefreshToken?: true
    dateOfBirth?: true
    roleId?: true
    organizationId?: true
    deletedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    title?: true
    imageUrl?: true
    firstName?: true
    lastName?: true
    gender?: true
    email?: true
    mobile?: true
    passwordHash?: true
    isActive?: true
    hashedRefreshToken?: true
    dateOfBirth?: true
    roleId?: true
    organizationId?: true
    deletedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    title: $Enums.Title
    imageUrl: string
    firstName: string
    lastName: string
    gender: string
    email: string
    mobile: string
    passwordHash: string
    isActive: boolean
    hashedRefreshToken: string
    dateOfBirth: Date
    roleId: number
    organizationId: number
    deletedAt: Date | null
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    imageUrl?: boolean
    firstName?: boolean
    lastName?: boolean
    gender?: boolean
    email?: boolean
    mobile?: boolean
    passwordHash?: boolean
    isActive?: boolean
    hashedRefreshToken?: boolean
    dateOfBirth?: boolean
    roleId?: boolean
    organizationId?: boolean
    deletedAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    settings?: boolean | User$settingsArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    loginSessions?: boolean | User$loginSessionsArgs<ExtArgs>
    AdminAccess?: boolean | User$AdminAccessArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    imageUrl?: boolean
    firstName?: boolean
    lastName?: boolean
    gender?: boolean
    email?: boolean
    mobile?: boolean
    passwordHash?: boolean
    isActive?: boolean
    hashedRefreshToken?: boolean
    dateOfBirth?: boolean
    roleId?: boolean
    organizationId?: boolean
    deletedAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    imageUrl?: boolean
    firstName?: boolean
    lastName?: boolean
    gender?: boolean
    email?: boolean
    mobile?: boolean
    passwordHash?: boolean
    isActive?: boolean
    hashedRefreshToken?: boolean
    dateOfBirth?: boolean
    roleId?: boolean
    organizationId?: boolean
    deletedAt?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    title?: boolean
    imageUrl?: boolean
    firstName?: boolean
    lastName?: boolean
    gender?: boolean
    email?: boolean
    mobile?: boolean
    passwordHash?: boolean
    isActive?: boolean
    hashedRefreshToken?: boolean
    dateOfBirth?: boolean
    roleId?: boolean
    organizationId?: boolean
    deletedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "imageUrl" | "firstName" | "lastName" | "gender" | "email" | "mobile" | "passwordHash" | "isActive" | "hashedRefreshToken" | "dateOfBirth" | "roleId" | "organizationId" | "deletedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    settings?: boolean | User$settingsArgs<ExtArgs>
    auditLogs?: boolean | User$auditLogsArgs<ExtArgs>
    loginSessions?: boolean | User$loginSessionsArgs<ExtArgs>
    AdminAccess?: boolean | User$AdminAccessArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      role: Prisma.$RolePayload<ExtArgs>
      organization: Prisma.$OrganizationPayload<ExtArgs>
      settings: Prisma.$SettingPayload<ExtArgs> | null
      auditLogs: Prisma.$AuditLogPayload<ExtArgs>[]
      loginSessions: Prisma.$LoginSessionPayload<ExtArgs>[]
      AdminAccess: Prisma.$UserHospitalAccessPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      title: $Enums.Title
      imageUrl: string
      firstName: string
      lastName: string
      gender: string
      email: string
      mobile: string
      passwordHash: string
      isActive: boolean
      hashedRefreshToken: string
      dateOfBirth: Date
      roleId: number
      organizationId: number
      deletedAt: Date | null
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    settings<T extends User$settingsArgs<ExtArgs> = {}>(args?: Subset<T, User$settingsArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    auditLogs<T extends User$auditLogsArgs<ExtArgs> = {}>(args?: Subset<T, User$auditLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    loginSessions<T extends User$loginSessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$loginSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    AdminAccess<T extends User$AdminAccessArgs<ExtArgs> = {}>(args?: Subset<T, User$AdminAccessArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserHospitalAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly title: FieldRef<"User", 'Title'>
    readonly imageUrl: FieldRef<"User", 'String'>
    readonly firstName: FieldRef<"User", 'String'>
    readonly lastName: FieldRef<"User", 'String'>
    readonly gender: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly mobile: FieldRef<"User", 'String'>
    readonly passwordHash: FieldRef<"User", 'String'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly hashedRefreshToken: FieldRef<"User", 'String'>
    readonly dateOfBirth: FieldRef<"User", 'DateTime'>
    readonly roleId: FieldRef<"User", 'Int'>
    readonly organizationId: FieldRef<"User", 'Int'>
    readonly deletedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.settings
   */
  export type User$settingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingInclude<ExtArgs> | null
    where?: SettingWhereInput
  }

  /**
   * User.auditLogs
   */
  export type User$auditLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    cursor?: AuditLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * User.loginSessions
   */
  export type User$loginSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginSession
     */
    select?: LoginSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginSession
     */
    omit?: LoginSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginSessionInclude<ExtArgs> | null
    where?: LoginSessionWhereInput
    orderBy?: LoginSessionOrderByWithRelationInput | LoginSessionOrderByWithRelationInput[]
    cursor?: LoginSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LoginSessionScalarFieldEnum | LoginSessionScalarFieldEnum[]
  }

  /**
   * User.AdminAccess
   */
  export type User$AdminAccessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserHospitalAccess
     */
    select?: UserHospitalAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserHospitalAccess
     */
    omit?: UserHospitalAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserHospitalAccessInclude<ExtArgs> | null
    where?: UserHospitalAccessWhereInput
    orderBy?: UserHospitalAccessOrderByWithRelationInput | UserHospitalAccessOrderByWithRelationInput[]
    cursor?: UserHospitalAccessWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserHospitalAccessScalarFieldEnum | UserHospitalAccessScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Organization
   */

  export type AggregateOrganization = {
    _count: OrganizationCountAggregateOutputType | null
    _avg: OrganizationAvgAggregateOutputType | null
    _sum: OrganizationSumAggregateOutputType | null
    _min: OrganizationMinAggregateOutputType | null
    _max: OrganizationMaxAggregateOutputType | null
  }

  export type OrganizationAvgAggregateOutputType = {
    id: number | null
  }

  export type OrganizationSumAggregateOutputType = {
    id: number | null
  }

  export type OrganizationMinAggregateOutputType = {
    id: number | null
    OrganizationName: string | null
    Organizationcode: string | null
    logoUrl: string | null
    email: string | null
    contactNumber: string | null
    Orgnizationtype: $Enums.OrganizationType | null
    website: string | null
    addressLine1: string | null
    addressLine2: string | null
    city: string | null
    state: string | null
    country: string | null
    postalCode: string | null
    registrationNo: string | null
    establishedOn: Date | null
    industryType: string | null
    status: $Enums.Hospital_Org_status | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrganizationMaxAggregateOutputType = {
    id: number | null
    OrganizationName: string | null
    Organizationcode: string | null
    logoUrl: string | null
    email: string | null
    contactNumber: string | null
    Orgnizationtype: $Enums.OrganizationType | null
    website: string | null
    addressLine1: string | null
    addressLine2: string | null
    city: string | null
    state: string | null
    country: string | null
    postalCode: string | null
    registrationNo: string | null
    establishedOn: Date | null
    industryType: string | null
    status: $Enums.Hospital_Org_status | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OrganizationCountAggregateOutputType = {
    id: number
    OrganizationName: number
    Organizationcode: number
    logoUrl: number
    email: number
    contactNumber: number
    Orgnizationtype: number
    website: number
    addressLine1: number
    addressLine2: number
    city: number
    state: number
    country: number
    postalCode: number
    registrationNo: number
    establishedOn: number
    industryType: number
    status: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OrganizationAvgAggregateInputType = {
    id?: true
  }

  export type OrganizationSumAggregateInputType = {
    id?: true
  }

  export type OrganizationMinAggregateInputType = {
    id?: true
    OrganizationName?: true
    Organizationcode?: true
    logoUrl?: true
    email?: true
    contactNumber?: true
    Orgnizationtype?: true
    website?: true
    addressLine1?: true
    addressLine2?: true
    city?: true
    state?: true
    country?: true
    postalCode?: true
    registrationNo?: true
    establishedOn?: true
    industryType?: true
    status?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrganizationMaxAggregateInputType = {
    id?: true
    OrganizationName?: true
    Organizationcode?: true
    logoUrl?: true
    email?: true
    contactNumber?: true
    Orgnizationtype?: true
    website?: true
    addressLine1?: true
    addressLine2?: true
    city?: true
    state?: true
    country?: true
    postalCode?: true
    registrationNo?: true
    establishedOn?: true
    industryType?: true
    status?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OrganizationCountAggregateInputType = {
    id?: true
    OrganizationName?: true
    Organizationcode?: true
    logoUrl?: true
    email?: true
    contactNumber?: true
    Orgnizationtype?: true
    website?: true
    addressLine1?: true
    addressLine2?: true
    city?: true
    state?: true
    country?: true
    postalCode?: true
    registrationNo?: true
    establishedOn?: true
    industryType?: true
    status?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OrganizationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organization to aggregate.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Organizations
    **/
    _count?: true | OrganizationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OrganizationAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OrganizationSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OrganizationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OrganizationMaxAggregateInputType
  }

  export type GetOrganizationAggregateType<T extends OrganizationAggregateArgs> = {
        [P in keyof T & keyof AggregateOrganization]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOrganization[P]>
      : GetScalarType<T[P], AggregateOrganization[P]>
  }




  export type OrganizationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OrganizationWhereInput
    orderBy?: OrganizationOrderByWithAggregationInput | OrganizationOrderByWithAggregationInput[]
    by: OrganizationScalarFieldEnum[] | OrganizationScalarFieldEnum
    having?: OrganizationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OrganizationCountAggregateInputType | true
    _avg?: OrganizationAvgAggregateInputType
    _sum?: OrganizationSumAggregateInputType
    _min?: OrganizationMinAggregateInputType
    _max?: OrganizationMaxAggregateInputType
  }

  export type OrganizationGroupByOutputType = {
    id: number
    OrganizationName: string
    Organizationcode: string
    logoUrl: string
    email: string
    contactNumber: string
    Orgnizationtype: $Enums.OrganizationType | null
    website: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    country: string
    postalCode: string
    registrationNo: string
    establishedOn: Date
    industryType: string
    status: $Enums.Hospital_Org_status
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count: OrganizationCountAggregateOutputType | null
    _avg: OrganizationAvgAggregateOutputType | null
    _sum: OrganizationSumAggregateOutputType | null
    _min: OrganizationMinAggregateOutputType | null
    _max: OrganizationMaxAggregateOutputType | null
  }

  type GetOrganizationGroupByPayload<T extends OrganizationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OrganizationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OrganizationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OrganizationGroupByOutputType[P]>
            : GetScalarType<T[P], OrganizationGroupByOutputType[P]>
        }
      >
    >


  export type OrganizationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    OrganizationName?: boolean
    Organizationcode?: boolean
    logoUrl?: boolean
    email?: boolean
    contactNumber?: boolean
    Orgnizationtype?: boolean
    website?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    postalCode?: boolean
    registrationNo?: boolean
    establishedOn?: boolean
    industryType?: boolean
    status?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    hospitals?: boolean | Organization$hospitalsArgs<ExtArgs>
    users?: boolean | Organization$usersArgs<ExtArgs>
    _count?: boolean | OrganizationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    OrganizationName?: boolean
    Organizationcode?: boolean
    logoUrl?: boolean
    email?: boolean
    contactNumber?: boolean
    Orgnizationtype?: boolean
    website?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    postalCode?: boolean
    registrationNo?: boolean
    establishedOn?: boolean
    industryType?: boolean
    status?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    OrganizationName?: boolean
    Organizationcode?: boolean
    logoUrl?: boolean
    email?: boolean
    contactNumber?: boolean
    Orgnizationtype?: boolean
    website?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    postalCode?: boolean
    registrationNo?: boolean
    establishedOn?: boolean
    industryType?: boolean
    status?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["organization"]>

  export type OrganizationSelectScalar = {
    id?: boolean
    OrganizationName?: boolean
    Organizationcode?: boolean
    logoUrl?: boolean
    email?: boolean
    contactNumber?: boolean
    Orgnizationtype?: boolean
    website?: boolean
    addressLine1?: boolean
    addressLine2?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    postalCode?: boolean
    registrationNo?: boolean
    establishedOn?: boolean
    industryType?: boolean
    status?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OrganizationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "OrganizationName" | "Organizationcode" | "logoUrl" | "email" | "contactNumber" | "Orgnizationtype" | "website" | "addressLine1" | "addressLine2" | "city" | "state" | "country" | "postalCode" | "registrationNo" | "establishedOn" | "industryType" | "status" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["organization"]>
  export type OrganizationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    hospitals?: boolean | Organization$hospitalsArgs<ExtArgs>
    users?: boolean | Organization$usersArgs<ExtArgs>
    _count?: boolean | OrganizationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type OrganizationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type OrganizationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $OrganizationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Organization"
    objects: {
      hospitals: Prisma.$HospitalPayload<ExtArgs>[]
      users: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      OrganizationName: string
      Organizationcode: string
      logoUrl: string
      email: string
      contactNumber: string
      Orgnizationtype: $Enums.OrganizationType | null
      website: string
      addressLine1: string
      addressLine2: string
      city: string
      state: string
      country: string
      postalCode: string
      registrationNo: string
      establishedOn: Date
      industryType: string
      status: $Enums.Hospital_Org_status
      description: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["organization"]>
    composites: {}
  }

  type OrganizationGetPayload<S extends boolean | null | undefined | OrganizationDefaultArgs> = $Result.GetResult<Prisma.$OrganizationPayload, S>

  type OrganizationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OrganizationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OrganizationCountAggregateInputType | true
    }

  export interface OrganizationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Organization'], meta: { name: 'Organization' } }
    /**
     * Find zero or one Organization that matches the filter.
     * @param {OrganizationFindUniqueArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrganizationFindUniqueArgs>(args: SelectSubset<T, OrganizationFindUniqueArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Organization that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrganizationFindUniqueOrThrowArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrganizationFindUniqueOrThrowArgs>(args: SelectSubset<T, OrganizationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organization that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindFirstArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrganizationFindFirstArgs>(args?: SelectSubset<T, OrganizationFindFirstArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Organization that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindFirstOrThrowArgs} args - Arguments to find a Organization
     * @example
     * // Get one Organization
     * const organization = await prisma.organization.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrganizationFindFirstOrThrowArgs>(args?: SelectSubset<T, OrganizationFindFirstOrThrowArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Organizations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Organizations
     * const organizations = await prisma.organization.findMany()
     * 
     * // Get first 10 Organizations
     * const organizations = await prisma.organization.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const organizationWithIdOnly = await prisma.organization.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OrganizationFindManyArgs>(args?: SelectSubset<T, OrganizationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Organization.
     * @param {OrganizationCreateArgs} args - Arguments to create a Organization.
     * @example
     * // Create one Organization
     * const Organization = await prisma.organization.create({
     *   data: {
     *     // ... data to create a Organization
     *   }
     * })
     * 
     */
    create<T extends OrganizationCreateArgs>(args: SelectSubset<T, OrganizationCreateArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Organizations.
     * @param {OrganizationCreateManyArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organization = await prisma.organization.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OrganizationCreateManyArgs>(args?: SelectSubset<T, OrganizationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Organizations and returns the data saved in the database.
     * @param {OrganizationCreateManyAndReturnArgs} args - Arguments to create many Organizations.
     * @example
     * // Create many Organizations
     * const organization = await prisma.organization.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Organizations and only return the `id`
     * const organizationWithIdOnly = await prisma.organization.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends OrganizationCreateManyAndReturnArgs>(args?: SelectSubset<T, OrganizationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Organization.
     * @param {OrganizationDeleteArgs} args - Arguments to delete one Organization.
     * @example
     * // Delete one Organization
     * const Organization = await prisma.organization.delete({
     *   where: {
     *     // ... filter to delete one Organization
     *   }
     * })
     * 
     */
    delete<T extends OrganizationDeleteArgs>(args: SelectSubset<T, OrganizationDeleteArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Organization.
     * @param {OrganizationUpdateArgs} args - Arguments to update one Organization.
     * @example
     * // Update one Organization
     * const organization = await prisma.organization.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OrganizationUpdateArgs>(args: SelectSubset<T, OrganizationUpdateArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Organizations.
     * @param {OrganizationDeleteManyArgs} args - Arguments to filter Organizations to delete.
     * @example
     * // Delete a few Organizations
     * const { count } = await prisma.organization.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OrganizationDeleteManyArgs>(args?: SelectSubset<T, OrganizationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Organizations
     * const organization = await prisma.organization.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OrganizationUpdateManyArgs>(args: SelectSubset<T, OrganizationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Organizations and returns the data updated in the database.
     * @param {OrganizationUpdateManyAndReturnArgs} args - Arguments to update many Organizations.
     * @example
     * // Update many Organizations
     * const organization = await prisma.organization.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Organizations and only return the `id`
     * const organizationWithIdOnly = await prisma.organization.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends OrganizationUpdateManyAndReturnArgs>(args: SelectSubset<T, OrganizationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Organization.
     * @param {OrganizationUpsertArgs} args - Arguments to update or create a Organization.
     * @example
     * // Update or create a Organization
     * const organization = await prisma.organization.upsert({
     *   create: {
     *     // ... data to create a Organization
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Organization we want to update
     *   }
     * })
     */
    upsert<T extends OrganizationUpsertArgs>(args: SelectSubset<T, OrganizationUpsertArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Organizations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationCountArgs} args - Arguments to filter Organizations to count.
     * @example
     * // Count the number of Organizations
     * const count = await prisma.organization.count({
     *   where: {
     *     // ... the filter for the Organizations we want to count
     *   }
     * })
    **/
    count<T extends OrganizationCountArgs>(
      args?: Subset<T, OrganizationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OrganizationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Organization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrganizationAggregateArgs>(args: Subset<T, OrganizationAggregateArgs>): Prisma.PrismaPromise<GetOrganizationAggregateType<T>>

    /**
     * Group by Organization.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrganizationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends OrganizationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OrganizationGroupByArgs['orderBy'] }
        : { orderBy?: OrganizationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, OrganizationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrganizationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Organization model
   */
  readonly fields: OrganizationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Organization.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OrganizationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    hospitals<T extends Organization$hospitalsArgs<ExtArgs> = {}>(args?: Subset<T, Organization$hospitalsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    users<T extends Organization$usersArgs<ExtArgs> = {}>(args?: Subset<T, Organization$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Organization model
   */
  interface OrganizationFieldRefs {
    readonly id: FieldRef<"Organization", 'Int'>
    readonly OrganizationName: FieldRef<"Organization", 'String'>
    readonly Organizationcode: FieldRef<"Organization", 'String'>
    readonly logoUrl: FieldRef<"Organization", 'String'>
    readonly email: FieldRef<"Organization", 'String'>
    readonly contactNumber: FieldRef<"Organization", 'String'>
    readonly Orgnizationtype: FieldRef<"Organization", 'OrganizationType'>
    readonly website: FieldRef<"Organization", 'String'>
    readonly addressLine1: FieldRef<"Organization", 'String'>
    readonly addressLine2: FieldRef<"Organization", 'String'>
    readonly city: FieldRef<"Organization", 'String'>
    readonly state: FieldRef<"Organization", 'String'>
    readonly country: FieldRef<"Organization", 'String'>
    readonly postalCode: FieldRef<"Organization", 'String'>
    readonly registrationNo: FieldRef<"Organization", 'String'>
    readonly establishedOn: FieldRef<"Organization", 'DateTime'>
    readonly industryType: FieldRef<"Organization", 'String'>
    readonly status: FieldRef<"Organization", 'Hospital_Org_status'>
    readonly description: FieldRef<"Organization", 'String'>
    readonly createdAt: FieldRef<"Organization", 'DateTime'>
    readonly updatedAt: FieldRef<"Organization", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Organization findUnique
   */
  export type OrganizationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization findUniqueOrThrow
   */
  export type OrganizationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization findFirst
   */
  export type OrganizationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organizations.
     */
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization findFirstOrThrow
   */
  export type OrganizationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organization to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Organizations.
     */
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization findMany
   */
  export type OrganizationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter, which Organizations to fetch.
     */
    where?: OrganizationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Organizations to fetch.
     */
    orderBy?: OrganizationOrderByWithRelationInput | OrganizationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Organizations.
     */
    cursor?: OrganizationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Organizations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Organizations.
     */
    skip?: number
    distinct?: OrganizationScalarFieldEnum | OrganizationScalarFieldEnum[]
  }

  /**
   * Organization create
   */
  export type OrganizationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The data needed to create a Organization.
     */
    data: XOR<OrganizationCreateInput, OrganizationUncheckedCreateInput>
  }

  /**
   * Organization createMany
   */
  export type OrganizationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Organizations.
     */
    data: OrganizationCreateManyInput | OrganizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organization createManyAndReturn
   */
  export type OrganizationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * The data used to create many Organizations.
     */
    data: OrganizationCreateManyInput | OrganizationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Organization update
   */
  export type OrganizationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The data needed to update a Organization.
     */
    data: XOR<OrganizationUpdateInput, OrganizationUncheckedUpdateInput>
    /**
     * Choose, which Organization to update.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization updateMany
   */
  export type OrganizationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Organizations.
     */
    data: XOR<OrganizationUpdateManyMutationInput, OrganizationUncheckedUpdateManyInput>
    /**
     * Filter which Organizations to update
     */
    where?: OrganizationWhereInput
    /**
     * Limit how many Organizations to update.
     */
    limit?: number
  }

  /**
   * Organization updateManyAndReturn
   */
  export type OrganizationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * The data used to update Organizations.
     */
    data: XOR<OrganizationUpdateManyMutationInput, OrganizationUncheckedUpdateManyInput>
    /**
     * Filter which Organizations to update
     */
    where?: OrganizationWhereInput
    /**
     * Limit how many Organizations to update.
     */
    limit?: number
  }

  /**
   * Organization upsert
   */
  export type OrganizationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * The filter to search for the Organization to update in case it exists.
     */
    where: OrganizationWhereUniqueInput
    /**
     * In case the Organization found by the `where` argument doesn't exist, create a new Organization with this data.
     */
    create: XOR<OrganizationCreateInput, OrganizationUncheckedCreateInput>
    /**
     * In case the Organization was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OrganizationUpdateInput, OrganizationUncheckedUpdateInput>
  }

  /**
   * Organization delete
   */
  export type OrganizationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
    /**
     * Filter which Organization to delete.
     */
    where: OrganizationWhereUniqueInput
  }

  /**
   * Organization deleteMany
   */
  export type OrganizationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Organizations to delete
     */
    where?: OrganizationWhereInput
    /**
     * Limit how many Organizations to delete.
     */
    limit?: number
  }

  /**
   * Organization.hospitals
   */
  export type Organization$hospitalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    where?: HospitalWhereInput
    orderBy?: HospitalOrderByWithRelationInput | HospitalOrderByWithRelationInput[]
    cursor?: HospitalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: HospitalScalarFieldEnum | HospitalScalarFieldEnum[]
  }

  /**
   * Organization.users
   */
  export type Organization$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Organization without action
   */
  export type OrganizationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Organization
     */
    select?: OrganizationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Organization
     */
    omit?: OrganizationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OrganizationInclude<ExtArgs> | null
  }


  /**
   * Model Hospital
   */

  export type AggregateHospital = {
    _count: HospitalCountAggregateOutputType | null
    _avg: HospitalAvgAggregateOutputType | null
    _sum: HospitalSumAggregateOutputType | null
    _min: HospitalMinAggregateOutputType | null
    _max: HospitalMaxAggregateOutputType | null
  }

  export type HospitalAvgAggregateOutputType = {
    id: number | null
    latitude: number | null
    longitude: number | null
    parentHospitalId: number | null
    organizationId: number | null
  }

  export type HospitalSumAggregateOutputType = {
    id: number | null
    latitude: number | null
    longitude: number | null
    parentHospitalId: number | null
    organizationId: number | null
  }

  export type HospitalMinAggregateOutputType = {
    id: number | null
    name: string | null
    hospitalCode: string | null
    ParentHospitalCode: string | null
    Organizationcode: string | null
    SpecializationType: $Enums.SpecializationType | null
    address: string | null
    city: string | null
    state: string | null
    country: string | null
    postalCode: string | null
    contactNumber: string | null
    email: string | null
    website: string | null
    logoUrl: string | null
    latitude: number | null
    longitude: number | null
    status: $Enums.Hospital_Org_status | null
    level: $Enums.HospitalLevel | null
    parentHospitalId: number | null
    organizationId: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type HospitalMaxAggregateOutputType = {
    id: number | null
    name: string | null
    hospitalCode: string | null
    ParentHospitalCode: string | null
    Organizationcode: string | null
    SpecializationType: $Enums.SpecializationType | null
    address: string | null
    city: string | null
    state: string | null
    country: string | null
    postalCode: string | null
    contactNumber: string | null
    email: string | null
    website: string | null
    logoUrl: string | null
    latitude: number | null
    longitude: number | null
    status: $Enums.Hospital_Org_status | null
    level: $Enums.HospitalLevel | null
    parentHospitalId: number | null
    organizationId: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
    deletedAt: Date | null
  }

  export type HospitalCountAggregateOutputType = {
    id: number
    name: number
    hospitalCode: number
    ParentHospitalCode: number
    Organizationcode: number
    SpecializationType: number
    address: number
    city: number
    state: number
    country: number
    postalCode: number
    contactNumber: number
    email: number
    website: number
    logoUrl: number
    latitude: number
    longitude: number
    status: number
    level: number
    parentHospitalId: number
    organizationId: number
    isActive: number
    createdAt: number
    updatedAt: number
    deletedAt: number
    _all: number
  }


  export type HospitalAvgAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
    parentHospitalId?: true
    organizationId?: true
  }

  export type HospitalSumAggregateInputType = {
    id?: true
    latitude?: true
    longitude?: true
    parentHospitalId?: true
    organizationId?: true
  }

  export type HospitalMinAggregateInputType = {
    id?: true
    name?: true
    hospitalCode?: true
    ParentHospitalCode?: true
    Organizationcode?: true
    SpecializationType?: true
    address?: true
    city?: true
    state?: true
    country?: true
    postalCode?: true
    contactNumber?: true
    email?: true
    website?: true
    logoUrl?: true
    latitude?: true
    longitude?: true
    status?: true
    level?: true
    parentHospitalId?: true
    organizationId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type HospitalMaxAggregateInputType = {
    id?: true
    name?: true
    hospitalCode?: true
    ParentHospitalCode?: true
    Organizationcode?: true
    SpecializationType?: true
    address?: true
    city?: true
    state?: true
    country?: true
    postalCode?: true
    contactNumber?: true
    email?: true
    website?: true
    logoUrl?: true
    latitude?: true
    longitude?: true
    status?: true
    level?: true
    parentHospitalId?: true
    organizationId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
  }

  export type HospitalCountAggregateInputType = {
    id?: true
    name?: true
    hospitalCode?: true
    ParentHospitalCode?: true
    Organizationcode?: true
    SpecializationType?: true
    address?: true
    city?: true
    state?: true
    country?: true
    postalCode?: true
    contactNumber?: true
    email?: true
    website?: true
    logoUrl?: true
    latitude?: true
    longitude?: true
    status?: true
    level?: true
    parentHospitalId?: true
    organizationId?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    deletedAt?: true
    _all?: true
  }

  export type HospitalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Hospital to aggregate.
     */
    where?: HospitalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hospitals to fetch.
     */
    orderBy?: HospitalOrderByWithRelationInput | HospitalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: HospitalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hospitals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hospitals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Hospitals
    **/
    _count?: true | HospitalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: HospitalAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: HospitalSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: HospitalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: HospitalMaxAggregateInputType
  }

  export type GetHospitalAggregateType<T extends HospitalAggregateArgs> = {
        [P in keyof T & keyof AggregateHospital]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateHospital[P]>
      : GetScalarType<T[P], AggregateHospital[P]>
  }




  export type HospitalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: HospitalWhereInput
    orderBy?: HospitalOrderByWithAggregationInput | HospitalOrderByWithAggregationInput[]
    by: HospitalScalarFieldEnum[] | HospitalScalarFieldEnum
    having?: HospitalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: HospitalCountAggregateInputType | true
    _avg?: HospitalAvgAggregateInputType
    _sum?: HospitalSumAggregateInputType
    _min?: HospitalMinAggregateInputType
    _max?: HospitalMaxAggregateInputType
  }

  export type HospitalGroupByOutputType = {
    id: number
    name: string
    hospitalCode: string
    ParentHospitalCode: string | null
    Organizationcode: string | null
    SpecializationType: $Enums.SpecializationType
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    contactNumber: string
    email: string
    website: string
    logoUrl: string
    latitude: number
    longitude: number
    status: $Enums.Hospital_Org_status
    level: $Enums.HospitalLevel
    parentHospitalId: number | null
    organizationId: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    deletedAt: Date | null
    _count: HospitalCountAggregateOutputType | null
    _avg: HospitalAvgAggregateOutputType | null
    _sum: HospitalSumAggregateOutputType | null
    _min: HospitalMinAggregateOutputType | null
    _max: HospitalMaxAggregateOutputType | null
  }

  type GetHospitalGroupByPayload<T extends HospitalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<HospitalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof HospitalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], HospitalGroupByOutputType[P]>
            : GetScalarType<T[P], HospitalGroupByOutputType[P]>
        }
      >
    >


  export type HospitalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    hospitalCode?: boolean
    ParentHospitalCode?: boolean
    Organizationcode?: boolean
    SpecializationType?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    postalCode?: boolean
    contactNumber?: boolean
    email?: boolean
    website?: boolean
    logoUrl?: boolean
    latitude?: boolean
    longitude?: boolean
    status?: boolean
    level?: boolean
    parentHospitalId?: boolean
    organizationId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    parentHospital?: boolean | Hospital$parentHospitalArgs<ExtArgs>
    childHospital?: boolean | Hospital$childHospitalArgs<ExtArgs>
    Organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    users?: boolean | Hospital$usersArgs<ExtArgs>
    _count?: boolean | HospitalCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["hospital"]>

  export type HospitalSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    hospitalCode?: boolean
    ParentHospitalCode?: boolean
    Organizationcode?: boolean
    SpecializationType?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    postalCode?: boolean
    contactNumber?: boolean
    email?: boolean
    website?: boolean
    logoUrl?: boolean
    latitude?: boolean
    longitude?: boolean
    status?: boolean
    level?: boolean
    parentHospitalId?: boolean
    organizationId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    parentHospital?: boolean | Hospital$parentHospitalArgs<ExtArgs>
    Organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["hospital"]>

  export type HospitalSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    hospitalCode?: boolean
    ParentHospitalCode?: boolean
    Organizationcode?: boolean
    SpecializationType?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    postalCode?: boolean
    contactNumber?: boolean
    email?: boolean
    website?: boolean
    logoUrl?: boolean
    latitude?: boolean
    longitude?: boolean
    status?: boolean
    level?: boolean
    parentHospitalId?: boolean
    organizationId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
    parentHospital?: boolean | Hospital$parentHospitalArgs<ExtArgs>
    Organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["hospital"]>

  export type HospitalSelectScalar = {
    id?: boolean
    name?: boolean
    hospitalCode?: boolean
    ParentHospitalCode?: boolean
    Organizationcode?: boolean
    SpecializationType?: boolean
    address?: boolean
    city?: boolean
    state?: boolean
    country?: boolean
    postalCode?: boolean
    contactNumber?: boolean
    email?: boolean
    website?: boolean
    logoUrl?: boolean
    latitude?: boolean
    longitude?: boolean
    status?: boolean
    level?: boolean
    parentHospitalId?: boolean
    organizationId?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    deletedAt?: boolean
  }

  export type HospitalOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "hospitalCode" | "ParentHospitalCode" | "Organizationcode" | "SpecializationType" | "address" | "city" | "state" | "country" | "postalCode" | "contactNumber" | "email" | "website" | "logoUrl" | "latitude" | "longitude" | "status" | "level" | "parentHospitalId" | "organizationId" | "isActive" | "createdAt" | "updatedAt" | "deletedAt", ExtArgs["result"]["hospital"]>
  export type HospitalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parentHospital?: boolean | Hospital$parentHospitalArgs<ExtArgs>
    childHospital?: boolean | Hospital$childHospitalArgs<ExtArgs>
    Organization?: boolean | OrganizationDefaultArgs<ExtArgs>
    users?: boolean | Hospital$usersArgs<ExtArgs>
    _count?: boolean | HospitalCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type HospitalIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parentHospital?: boolean | Hospital$parentHospitalArgs<ExtArgs>
    Organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }
  export type HospitalIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    parentHospital?: boolean | Hospital$parentHospitalArgs<ExtArgs>
    Organization?: boolean | OrganizationDefaultArgs<ExtArgs>
  }

  export type $HospitalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Hospital"
    objects: {
      parentHospital: Prisma.$HospitalPayload<ExtArgs> | null
      childHospital: Prisma.$HospitalPayload<ExtArgs>[]
      Organization: Prisma.$OrganizationPayload<ExtArgs>
      users: Prisma.$UserHospitalAccessPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      hospitalCode: string
      ParentHospitalCode: string | null
      Organizationcode: string | null
      SpecializationType: $Enums.SpecializationType
      address: string
      city: string
      state: string
      country: string
      postalCode: string
      contactNumber: string
      email: string
      website: string
      logoUrl: string
      latitude: number
      longitude: number
      status: $Enums.Hospital_Org_status
      level: $Enums.HospitalLevel
      parentHospitalId: number | null
      organizationId: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
      deletedAt: Date | null
    }, ExtArgs["result"]["hospital"]>
    composites: {}
  }

  type HospitalGetPayload<S extends boolean | null | undefined | HospitalDefaultArgs> = $Result.GetResult<Prisma.$HospitalPayload, S>

  type HospitalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<HospitalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: HospitalCountAggregateInputType | true
    }

  export interface HospitalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Hospital'], meta: { name: 'Hospital' } }
    /**
     * Find zero or one Hospital that matches the filter.
     * @param {HospitalFindUniqueArgs} args - Arguments to find a Hospital
     * @example
     * // Get one Hospital
     * const hospital = await prisma.hospital.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends HospitalFindUniqueArgs>(args: SelectSubset<T, HospitalFindUniqueArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Hospital that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {HospitalFindUniqueOrThrowArgs} args - Arguments to find a Hospital
     * @example
     * // Get one Hospital
     * const hospital = await prisma.hospital.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends HospitalFindUniqueOrThrowArgs>(args: SelectSubset<T, HospitalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Hospital that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HospitalFindFirstArgs} args - Arguments to find a Hospital
     * @example
     * // Get one Hospital
     * const hospital = await prisma.hospital.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends HospitalFindFirstArgs>(args?: SelectSubset<T, HospitalFindFirstArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Hospital that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HospitalFindFirstOrThrowArgs} args - Arguments to find a Hospital
     * @example
     * // Get one Hospital
     * const hospital = await prisma.hospital.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends HospitalFindFirstOrThrowArgs>(args?: SelectSubset<T, HospitalFindFirstOrThrowArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Hospitals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HospitalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Hospitals
     * const hospitals = await prisma.hospital.findMany()
     * 
     * // Get first 10 Hospitals
     * const hospitals = await prisma.hospital.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const hospitalWithIdOnly = await prisma.hospital.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends HospitalFindManyArgs>(args?: SelectSubset<T, HospitalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Hospital.
     * @param {HospitalCreateArgs} args - Arguments to create a Hospital.
     * @example
     * // Create one Hospital
     * const Hospital = await prisma.hospital.create({
     *   data: {
     *     // ... data to create a Hospital
     *   }
     * })
     * 
     */
    create<T extends HospitalCreateArgs>(args: SelectSubset<T, HospitalCreateArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Hospitals.
     * @param {HospitalCreateManyArgs} args - Arguments to create many Hospitals.
     * @example
     * // Create many Hospitals
     * const hospital = await prisma.hospital.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends HospitalCreateManyArgs>(args?: SelectSubset<T, HospitalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Hospitals and returns the data saved in the database.
     * @param {HospitalCreateManyAndReturnArgs} args - Arguments to create many Hospitals.
     * @example
     * // Create many Hospitals
     * const hospital = await prisma.hospital.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Hospitals and only return the `id`
     * const hospitalWithIdOnly = await prisma.hospital.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends HospitalCreateManyAndReturnArgs>(args?: SelectSubset<T, HospitalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Hospital.
     * @param {HospitalDeleteArgs} args - Arguments to delete one Hospital.
     * @example
     * // Delete one Hospital
     * const Hospital = await prisma.hospital.delete({
     *   where: {
     *     // ... filter to delete one Hospital
     *   }
     * })
     * 
     */
    delete<T extends HospitalDeleteArgs>(args: SelectSubset<T, HospitalDeleteArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Hospital.
     * @param {HospitalUpdateArgs} args - Arguments to update one Hospital.
     * @example
     * // Update one Hospital
     * const hospital = await prisma.hospital.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends HospitalUpdateArgs>(args: SelectSubset<T, HospitalUpdateArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Hospitals.
     * @param {HospitalDeleteManyArgs} args - Arguments to filter Hospitals to delete.
     * @example
     * // Delete a few Hospitals
     * const { count } = await prisma.hospital.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends HospitalDeleteManyArgs>(args?: SelectSubset<T, HospitalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Hospitals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HospitalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Hospitals
     * const hospital = await prisma.hospital.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends HospitalUpdateManyArgs>(args: SelectSubset<T, HospitalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Hospitals and returns the data updated in the database.
     * @param {HospitalUpdateManyAndReturnArgs} args - Arguments to update many Hospitals.
     * @example
     * // Update many Hospitals
     * const hospital = await prisma.hospital.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Hospitals and only return the `id`
     * const hospitalWithIdOnly = await prisma.hospital.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends HospitalUpdateManyAndReturnArgs>(args: SelectSubset<T, HospitalUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Hospital.
     * @param {HospitalUpsertArgs} args - Arguments to update or create a Hospital.
     * @example
     * // Update or create a Hospital
     * const hospital = await prisma.hospital.upsert({
     *   create: {
     *     // ... data to create a Hospital
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Hospital we want to update
     *   }
     * })
     */
    upsert<T extends HospitalUpsertArgs>(args: SelectSubset<T, HospitalUpsertArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Hospitals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HospitalCountArgs} args - Arguments to filter Hospitals to count.
     * @example
     * // Count the number of Hospitals
     * const count = await prisma.hospital.count({
     *   where: {
     *     // ... the filter for the Hospitals we want to count
     *   }
     * })
    **/
    count<T extends HospitalCountArgs>(
      args?: Subset<T, HospitalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], HospitalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Hospital.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HospitalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends HospitalAggregateArgs>(args: Subset<T, HospitalAggregateArgs>): Prisma.PrismaPromise<GetHospitalAggregateType<T>>

    /**
     * Group by Hospital.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {HospitalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends HospitalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: HospitalGroupByArgs['orderBy'] }
        : { orderBy?: HospitalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, HospitalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHospitalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Hospital model
   */
  readonly fields: HospitalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Hospital.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__HospitalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    parentHospital<T extends Hospital$parentHospitalArgs<ExtArgs> = {}>(args?: Subset<T, Hospital$parentHospitalArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    childHospital<T extends Hospital$childHospitalArgs<ExtArgs> = {}>(args?: Subset<T, Hospital$childHospitalArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    Organization<T extends OrganizationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OrganizationDefaultArgs<ExtArgs>>): Prisma__OrganizationClient<$Result.GetResult<Prisma.$OrganizationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    users<T extends Hospital$usersArgs<ExtArgs> = {}>(args?: Subset<T, Hospital$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserHospitalAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Hospital model
   */
  interface HospitalFieldRefs {
    readonly id: FieldRef<"Hospital", 'Int'>
    readonly name: FieldRef<"Hospital", 'String'>
    readonly hospitalCode: FieldRef<"Hospital", 'String'>
    readonly ParentHospitalCode: FieldRef<"Hospital", 'String'>
    readonly Organizationcode: FieldRef<"Hospital", 'String'>
    readonly SpecializationType: FieldRef<"Hospital", 'SpecializationType'>
    readonly address: FieldRef<"Hospital", 'String'>
    readonly city: FieldRef<"Hospital", 'String'>
    readonly state: FieldRef<"Hospital", 'String'>
    readonly country: FieldRef<"Hospital", 'String'>
    readonly postalCode: FieldRef<"Hospital", 'String'>
    readonly contactNumber: FieldRef<"Hospital", 'String'>
    readonly email: FieldRef<"Hospital", 'String'>
    readonly website: FieldRef<"Hospital", 'String'>
    readonly logoUrl: FieldRef<"Hospital", 'String'>
    readonly latitude: FieldRef<"Hospital", 'Float'>
    readonly longitude: FieldRef<"Hospital", 'Float'>
    readonly status: FieldRef<"Hospital", 'Hospital_Org_status'>
    readonly level: FieldRef<"Hospital", 'HospitalLevel'>
    readonly parentHospitalId: FieldRef<"Hospital", 'Int'>
    readonly organizationId: FieldRef<"Hospital", 'Int'>
    readonly isActive: FieldRef<"Hospital", 'Boolean'>
    readonly createdAt: FieldRef<"Hospital", 'DateTime'>
    readonly updatedAt: FieldRef<"Hospital", 'DateTime'>
    readonly deletedAt: FieldRef<"Hospital", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Hospital findUnique
   */
  export type HospitalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    /**
     * Filter, which Hospital to fetch.
     */
    where: HospitalWhereUniqueInput
  }

  /**
   * Hospital findUniqueOrThrow
   */
  export type HospitalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    /**
     * Filter, which Hospital to fetch.
     */
    where: HospitalWhereUniqueInput
  }

  /**
   * Hospital findFirst
   */
  export type HospitalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    /**
     * Filter, which Hospital to fetch.
     */
    where?: HospitalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hospitals to fetch.
     */
    orderBy?: HospitalOrderByWithRelationInput | HospitalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Hospitals.
     */
    cursor?: HospitalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hospitals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hospitals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Hospitals.
     */
    distinct?: HospitalScalarFieldEnum | HospitalScalarFieldEnum[]
  }

  /**
   * Hospital findFirstOrThrow
   */
  export type HospitalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    /**
     * Filter, which Hospital to fetch.
     */
    where?: HospitalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hospitals to fetch.
     */
    orderBy?: HospitalOrderByWithRelationInput | HospitalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Hospitals.
     */
    cursor?: HospitalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hospitals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hospitals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Hospitals.
     */
    distinct?: HospitalScalarFieldEnum | HospitalScalarFieldEnum[]
  }

  /**
   * Hospital findMany
   */
  export type HospitalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    /**
     * Filter, which Hospitals to fetch.
     */
    where?: HospitalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Hospitals to fetch.
     */
    orderBy?: HospitalOrderByWithRelationInput | HospitalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Hospitals.
     */
    cursor?: HospitalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Hospitals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Hospitals.
     */
    skip?: number
    distinct?: HospitalScalarFieldEnum | HospitalScalarFieldEnum[]
  }

  /**
   * Hospital create
   */
  export type HospitalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    /**
     * The data needed to create a Hospital.
     */
    data: XOR<HospitalCreateInput, HospitalUncheckedCreateInput>
  }

  /**
   * Hospital createMany
   */
  export type HospitalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Hospitals.
     */
    data: HospitalCreateManyInput | HospitalCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Hospital createManyAndReturn
   */
  export type HospitalCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * The data used to create many Hospitals.
     */
    data: HospitalCreateManyInput | HospitalCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Hospital update
   */
  export type HospitalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    /**
     * The data needed to update a Hospital.
     */
    data: XOR<HospitalUpdateInput, HospitalUncheckedUpdateInput>
    /**
     * Choose, which Hospital to update.
     */
    where: HospitalWhereUniqueInput
  }

  /**
   * Hospital updateMany
   */
  export type HospitalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Hospitals.
     */
    data: XOR<HospitalUpdateManyMutationInput, HospitalUncheckedUpdateManyInput>
    /**
     * Filter which Hospitals to update
     */
    where?: HospitalWhereInput
    /**
     * Limit how many Hospitals to update.
     */
    limit?: number
  }

  /**
   * Hospital updateManyAndReturn
   */
  export type HospitalUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * The data used to update Hospitals.
     */
    data: XOR<HospitalUpdateManyMutationInput, HospitalUncheckedUpdateManyInput>
    /**
     * Filter which Hospitals to update
     */
    where?: HospitalWhereInput
    /**
     * Limit how many Hospitals to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Hospital upsert
   */
  export type HospitalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    /**
     * The filter to search for the Hospital to update in case it exists.
     */
    where: HospitalWhereUniqueInput
    /**
     * In case the Hospital found by the `where` argument doesn't exist, create a new Hospital with this data.
     */
    create: XOR<HospitalCreateInput, HospitalUncheckedCreateInput>
    /**
     * In case the Hospital was found with the provided `where` argument, update it with this data.
     */
    update: XOR<HospitalUpdateInput, HospitalUncheckedUpdateInput>
  }

  /**
   * Hospital delete
   */
  export type HospitalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    /**
     * Filter which Hospital to delete.
     */
    where: HospitalWhereUniqueInput
  }

  /**
   * Hospital deleteMany
   */
  export type HospitalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Hospitals to delete
     */
    where?: HospitalWhereInput
    /**
     * Limit how many Hospitals to delete.
     */
    limit?: number
  }

  /**
   * Hospital.parentHospital
   */
  export type Hospital$parentHospitalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    where?: HospitalWhereInput
  }

  /**
   * Hospital.childHospital
   */
  export type Hospital$childHospitalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
    where?: HospitalWhereInput
    orderBy?: HospitalOrderByWithRelationInput | HospitalOrderByWithRelationInput[]
    cursor?: HospitalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: HospitalScalarFieldEnum | HospitalScalarFieldEnum[]
  }

  /**
   * Hospital.users
   */
  export type Hospital$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserHospitalAccess
     */
    select?: UserHospitalAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserHospitalAccess
     */
    omit?: UserHospitalAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserHospitalAccessInclude<ExtArgs> | null
    where?: UserHospitalAccessWhereInput
    orderBy?: UserHospitalAccessOrderByWithRelationInput | UserHospitalAccessOrderByWithRelationInput[]
    cursor?: UserHospitalAccessWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserHospitalAccessScalarFieldEnum | UserHospitalAccessScalarFieldEnum[]
  }

  /**
   * Hospital without action
   */
  export type HospitalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Hospital
     */
    select?: HospitalSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Hospital
     */
    omit?: HospitalOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: HospitalInclude<ExtArgs> | null
  }


  /**
   * Model UserHospitalAccess
   */

  export type AggregateUserHospitalAccess = {
    _count: UserHospitalAccessCountAggregateOutputType | null
    _avg: UserHospitalAccessAvgAggregateOutputType | null
    _sum: UserHospitalAccessSumAggregateOutputType | null
    _min: UserHospitalAccessMinAggregateOutputType | null
    _max: UserHospitalAccessMaxAggregateOutputType | null
  }

  export type UserHospitalAccessAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    hospitalId: number | null
    roleId: number | null
  }

  export type UserHospitalAccessSumAggregateOutputType = {
    id: number | null
    userId: number | null
    hospitalId: number | null
    roleId: number | null
  }

  export type UserHospitalAccessMinAggregateOutputType = {
    id: number | null
    userId: number | null
    hospitalId: number | null
    roleId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserHospitalAccessMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    hospitalId: number | null
    roleId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserHospitalAccessCountAggregateOutputType = {
    id: number
    userId: number
    hospitalId: number
    roleId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserHospitalAccessAvgAggregateInputType = {
    id?: true
    userId?: true
    hospitalId?: true
    roleId?: true
  }

  export type UserHospitalAccessSumAggregateInputType = {
    id?: true
    userId?: true
    hospitalId?: true
    roleId?: true
  }

  export type UserHospitalAccessMinAggregateInputType = {
    id?: true
    userId?: true
    hospitalId?: true
    roleId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserHospitalAccessMaxAggregateInputType = {
    id?: true
    userId?: true
    hospitalId?: true
    roleId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserHospitalAccessCountAggregateInputType = {
    id?: true
    userId?: true
    hospitalId?: true
    roleId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserHospitalAccessAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserHospitalAccess to aggregate.
     */
    where?: UserHospitalAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserHospitalAccesses to fetch.
     */
    orderBy?: UserHospitalAccessOrderByWithRelationInput | UserHospitalAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserHospitalAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserHospitalAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserHospitalAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserHospitalAccesses
    **/
    _count?: true | UserHospitalAccessCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserHospitalAccessAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserHospitalAccessSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserHospitalAccessMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserHospitalAccessMaxAggregateInputType
  }

  export type GetUserHospitalAccessAggregateType<T extends UserHospitalAccessAggregateArgs> = {
        [P in keyof T & keyof AggregateUserHospitalAccess]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserHospitalAccess[P]>
      : GetScalarType<T[P], AggregateUserHospitalAccess[P]>
  }




  export type UserHospitalAccessGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserHospitalAccessWhereInput
    orderBy?: UserHospitalAccessOrderByWithAggregationInput | UserHospitalAccessOrderByWithAggregationInput[]
    by: UserHospitalAccessScalarFieldEnum[] | UserHospitalAccessScalarFieldEnum
    having?: UserHospitalAccessScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserHospitalAccessCountAggregateInputType | true
    _avg?: UserHospitalAccessAvgAggregateInputType
    _sum?: UserHospitalAccessSumAggregateInputType
    _min?: UserHospitalAccessMinAggregateInputType
    _max?: UserHospitalAccessMaxAggregateInputType
  }

  export type UserHospitalAccessGroupByOutputType = {
    id: number
    userId: number
    hospitalId: number
    roleId: number
    createdAt: Date
    updatedAt: Date
    _count: UserHospitalAccessCountAggregateOutputType | null
    _avg: UserHospitalAccessAvgAggregateOutputType | null
    _sum: UserHospitalAccessSumAggregateOutputType | null
    _min: UserHospitalAccessMinAggregateOutputType | null
    _max: UserHospitalAccessMaxAggregateOutputType | null
  }

  type GetUserHospitalAccessGroupByPayload<T extends UserHospitalAccessGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserHospitalAccessGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserHospitalAccessGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserHospitalAccessGroupByOutputType[P]>
            : GetScalarType<T[P], UserHospitalAccessGroupByOutputType[P]>
        }
      >
    >


  export type UserHospitalAccessSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    hospitalId?: boolean
    roleId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    hospital?: boolean | HospitalDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userHospitalAccess"]>

  export type UserHospitalAccessSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    hospitalId?: boolean
    roleId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    hospital?: boolean | HospitalDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userHospitalAccess"]>

  export type UserHospitalAccessSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    hospitalId?: boolean
    roleId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    hospital?: boolean | HospitalDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userHospitalAccess"]>

  export type UserHospitalAccessSelectScalar = {
    id?: boolean
    userId?: boolean
    hospitalId?: boolean
    roleId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserHospitalAccessOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "hospitalId" | "roleId" | "createdAt" | "updatedAt", ExtArgs["result"]["userHospitalAccess"]>
  export type UserHospitalAccessInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    hospital?: boolean | HospitalDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }
  export type UserHospitalAccessIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    hospital?: boolean | HospitalDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }
  export type UserHospitalAccessIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    hospital?: boolean | HospitalDefaultArgs<ExtArgs>
    role?: boolean | RoleDefaultArgs<ExtArgs>
  }

  export type $UserHospitalAccessPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserHospitalAccess"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      hospital: Prisma.$HospitalPayload<ExtArgs>
      role: Prisma.$RolePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      hospitalId: number
      roleId: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userHospitalAccess"]>
    composites: {}
  }

  type UserHospitalAccessGetPayload<S extends boolean | null | undefined | UserHospitalAccessDefaultArgs> = $Result.GetResult<Prisma.$UserHospitalAccessPayload, S>

  type UserHospitalAccessCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserHospitalAccessFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserHospitalAccessCountAggregateInputType | true
    }

  export interface UserHospitalAccessDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserHospitalAccess'], meta: { name: 'UserHospitalAccess' } }
    /**
     * Find zero or one UserHospitalAccess that matches the filter.
     * @param {UserHospitalAccessFindUniqueArgs} args - Arguments to find a UserHospitalAccess
     * @example
     * // Get one UserHospitalAccess
     * const userHospitalAccess = await prisma.userHospitalAccess.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserHospitalAccessFindUniqueArgs>(args: SelectSubset<T, UserHospitalAccessFindUniqueArgs<ExtArgs>>): Prisma__UserHospitalAccessClient<$Result.GetResult<Prisma.$UserHospitalAccessPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserHospitalAccess that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserHospitalAccessFindUniqueOrThrowArgs} args - Arguments to find a UserHospitalAccess
     * @example
     * // Get one UserHospitalAccess
     * const userHospitalAccess = await prisma.userHospitalAccess.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserHospitalAccessFindUniqueOrThrowArgs>(args: SelectSubset<T, UserHospitalAccessFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserHospitalAccessClient<$Result.GetResult<Prisma.$UserHospitalAccessPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserHospitalAccess that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserHospitalAccessFindFirstArgs} args - Arguments to find a UserHospitalAccess
     * @example
     * // Get one UserHospitalAccess
     * const userHospitalAccess = await prisma.userHospitalAccess.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserHospitalAccessFindFirstArgs>(args?: SelectSubset<T, UserHospitalAccessFindFirstArgs<ExtArgs>>): Prisma__UserHospitalAccessClient<$Result.GetResult<Prisma.$UserHospitalAccessPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserHospitalAccess that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserHospitalAccessFindFirstOrThrowArgs} args - Arguments to find a UserHospitalAccess
     * @example
     * // Get one UserHospitalAccess
     * const userHospitalAccess = await prisma.userHospitalAccess.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserHospitalAccessFindFirstOrThrowArgs>(args?: SelectSubset<T, UserHospitalAccessFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserHospitalAccessClient<$Result.GetResult<Prisma.$UserHospitalAccessPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserHospitalAccesses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserHospitalAccessFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserHospitalAccesses
     * const userHospitalAccesses = await prisma.userHospitalAccess.findMany()
     * 
     * // Get first 10 UserHospitalAccesses
     * const userHospitalAccesses = await prisma.userHospitalAccess.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userHospitalAccessWithIdOnly = await prisma.userHospitalAccess.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserHospitalAccessFindManyArgs>(args?: SelectSubset<T, UserHospitalAccessFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserHospitalAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserHospitalAccess.
     * @param {UserHospitalAccessCreateArgs} args - Arguments to create a UserHospitalAccess.
     * @example
     * // Create one UserHospitalAccess
     * const UserHospitalAccess = await prisma.userHospitalAccess.create({
     *   data: {
     *     // ... data to create a UserHospitalAccess
     *   }
     * })
     * 
     */
    create<T extends UserHospitalAccessCreateArgs>(args: SelectSubset<T, UserHospitalAccessCreateArgs<ExtArgs>>): Prisma__UserHospitalAccessClient<$Result.GetResult<Prisma.$UserHospitalAccessPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserHospitalAccesses.
     * @param {UserHospitalAccessCreateManyArgs} args - Arguments to create many UserHospitalAccesses.
     * @example
     * // Create many UserHospitalAccesses
     * const userHospitalAccess = await prisma.userHospitalAccess.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserHospitalAccessCreateManyArgs>(args?: SelectSubset<T, UserHospitalAccessCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserHospitalAccesses and returns the data saved in the database.
     * @param {UserHospitalAccessCreateManyAndReturnArgs} args - Arguments to create many UserHospitalAccesses.
     * @example
     * // Create many UserHospitalAccesses
     * const userHospitalAccess = await prisma.userHospitalAccess.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserHospitalAccesses and only return the `id`
     * const userHospitalAccessWithIdOnly = await prisma.userHospitalAccess.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserHospitalAccessCreateManyAndReturnArgs>(args?: SelectSubset<T, UserHospitalAccessCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserHospitalAccessPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserHospitalAccess.
     * @param {UserHospitalAccessDeleteArgs} args - Arguments to delete one UserHospitalAccess.
     * @example
     * // Delete one UserHospitalAccess
     * const UserHospitalAccess = await prisma.userHospitalAccess.delete({
     *   where: {
     *     // ... filter to delete one UserHospitalAccess
     *   }
     * })
     * 
     */
    delete<T extends UserHospitalAccessDeleteArgs>(args: SelectSubset<T, UserHospitalAccessDeleteArgs<ExtArgs>>): Prisma__UserHospitalAccessClient<$Result.GetResult<Prisma.$UserHospitalAccessPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserHospitalAccess.
     * @param {UserHospitalAccessUpdateArgs} args - Arguments to update one UserHospitalAccess.
     * @example
     * // Update one UserHospitalAccess
     * const userHospitalAccess = await prisma.userHospitalAccess.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserHospitalAccessUpdateArgs>(args: SelectSubset<T, UserHospitalAccessUpdateArgs<ExtArgs>>): Prisma__UserHospitalAccessClient<$Result.GetResult<Prisma.$UserHospitalAccessPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserHospitalAccesses.
     * @param {UserHospitalAccessDeleteManyArgs} args - Arguments to filter UserHospitalAccesses to delete.
     * @example
     * // Delete a few UserHospitalAccesses
     * const { count } = await prisma.userHospitalAccess.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserHospitalAccessDeleteManyArgs>(args?: SelectSubset<T, UserHospitalAccessDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserHospitalAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserHospitalAccessUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserHospitalAccesses
     * const userHospitalAccess = await prisma.userHospitalAccess.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserHospitalAccessUpdateManyArgs>(args: SelectSubset<T, UserHospitalAccessUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserHospitalAccesses and returns the data updated in the database.
     * @param {UserHospitalAccessUpdateManyAndReturnArgs} args - Arguments to update many UserHospitalAccesses.
     * @example
     * // Update many UserHospitalAccesses
     * const userHospitalAccess = await prisma.userHospitalAccess.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserHospitalAccesses and only return the `id`
     * const userHospitalAccessWithIdOnly = await prisma.userHospitalAccess.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserHospitalAccessUpdateManyAndReturnArgs>(args: SelectSubset<T, UserHospitalAccessUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserHospitalAccessPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserHospitalAccess.
     * @param {UserHospitalAccessUpsertArgs} args - Arguments to update or create a UserHospitalAccess.
     * @example
     * // Update or create a UserHospitalAccess
     * const userHospitalAccess = await prisma.userHospitalAccess.upsert({
     *   create: {
     *     // ... data to create a UserHospitalAccess
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserHospitalAccess we want to update
     *   }
     * })
     */
    upsert<T extends UserHospitalAccessUpsertArgs>(args: SelectSubset<T, UserHospitalAccessUpsertArgs<ExtArgs>>): Prisma__UserHospitalAccessClient<$Result.GetResult<Prisma.$UserHospitalAccessPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserHospitalAccesses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserHospitalAccessCountArgs} args - Arguments to filter UserHospitalAccesses to count.
     * @example
     * // Count the number of UserHospitalAccesses
     * const count = await prisma.userHospitalAccess.count({
     *   where: {
     *     // ... the filter for the UserHospitalAccesses we want to count
     *   }
     * })
    **/
    count<T extends UserHospitalAccessCountArgs>(
      args?: Subset<T, UserHospitalAccessCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserHospitalAccessCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserHospitalAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserHospitalAccessAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserHospitalAccessAggregateArgs>(args: Subset<T, UserHospitalAccessAggregateArgs>): Prisma.PrismaPromise<GetUserHospitalAccessAggregateType<T>>

    /**
     * Group by UserHospitalAccess.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserHospitalAccessGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserHospitalAccessGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserHospitalAccessGroupByArgs['orderBy'] }
        : { orderBy?: UserHospitalAccessGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserHospitalAccessGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserHospitalAccessGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserHospitalAccess model
   */
  readonly fields: UserHospitalAccessFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserHospitalAccess.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserHospitalAccessClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    hospital<T extends HospitalDefaultArgs<ExtArgs> = {}>(args?: Subset<T, HospitalDefaultArgs<ExtArgs>>): Prisma__HospitalClient<$Result.GetResult<Prisma.$HospitalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserHospitalAccess model
   */
  interface UserHospitalAccessFieldRefs {
    readonly id: FieldRef<"UserHospitalAccess", 'Int'>
    readonly userId: FieldRef<"UserHospitalAccess", 'Int'>
    readonly hospitalId: FieldRef<"UserHospitalAccess", 'Int'>
    readonly roleId: FieldRef<"UserHospitalAccess", 'Int'>
    readonly createdAt: FieldRef<"UserHospitalAccess", 'DateTime'>
    readonly updatedAt: FieldRef<"UserHospitalAccess", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserHospitalAccess findUnique
   */
  export type UserHospitalAccessFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserHospitalAccess
     */
    select?: UserHospitalAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserHospitalAccess
     */
    omit?: UserHospitalAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserHospitalAccessInclude<ExtArgs> | null
    /**
     * Filter, which UserHospitalAccess to fetch.
     */
    where: UserHospitalAccessWhereUniqueInput
  }

  /**
   * UserHospitalAccess findUniqueOrThrow
   */
  export type UserHospitalAccessFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserHospitalAccess
     */
    select?: UserHospitalAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserHospitalAccess
     */
    omit?: UserHospitalAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserHospitalAccessInclude<ExtArgs> | null
    /**
     * Filter, which UserHospitalAccess to fetch.
     */
    where: UserHospitalAccessWhereUniqueInput
  }

  /**
   * UserHospitalAccess findFirst
   */
  export type UserHospitalAccessFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserHospitalAccess
     */
    select?: UserHospitalAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserHospitalAccess
     */
    omit?: UserHospitalAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserHospitalAccessInclude<ExtArgs> | null
    /**
     * Filter, which UserHospitalAccess to fetch.
     */
    where?: UserHospitalAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserHospitalAccesses to fetch.
     */
    orderBy?: UserHospitalAccessOrderByWithRelationInput | UserHospitalAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserHospitalAccesses.
     */
    cursor?: UserHospitalAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserHospitalAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserHospitalAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserHospitalAccesses.
     */
    distinct?: UserHospitalAccessScalarFieldEnum | UserHospitalAccessScalarFieldEnum[]
  }

  /**
   * UserHospitalAccess findFirstOrThrow
   */
  export type UserHospitalAccessFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserHospitalAccess
     */
    select?: UserHospitalAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserHospitalAccess
     */
    omit?: UserHospitalAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserHospitalAccessInclude<ExtArgs> | null
    /**
     * Filter, which UserHospitalAccess to fetch.
     */
    where?: UserHospitalAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserHospitalAccesses to fetch.
     */
    orderBy?: UserHospitalAccessOrderByWithRelationInput | UserHospitalAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserHospitalAccesses.
     */
    cursor?: UserHospitalAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserHospitalAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserHospitalAccesses.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserHospitalAccesses.
     */
    distinct?: UserHospitalAccessScalarFieldEnum | UserHospitalAccessScalarFieldEnum[]
  }

  /**
   * UserHospitalAccess findMany
   */
  export type UserHospitalAccessFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserHospitalAccess
     */
    select?: UserHospitalAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserHospitalAccess
     */
    omit?: UserHospitalAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserHospitalAccessInclude<ExtArgs> | null
    /**
     * Filter, which UserHospitalAccesses to fetch.
     */
    where?: UserHospitalAccessWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserHospitalAccesses to fetch.
     */
    orderBy?: UserHospitalAccessOrderByWithRelationInput | UserHospitalAccessOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserHospitalAccesses.
     */
    cursor?: UserHospitalAccessWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserHospitalAccesses from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserHospitalAccesses.
     */
    skip?: number
    distinct?: UserHospitalAccessScalarFieldEnum | UserHospitalAccessScalarFieldEnum[]
  }

  /**
   * UserHospitalAccess create
   */
  export type UserHospitalAccessCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserHospitalAccess
     */
    select?: UserHospitalAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserHospitalAccess
     */
    omit?: UserHospitalAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserHospitalAccessInclude<ExtArgs> | null
    /**
     * The data needed to create a UserHospitalAccess.
     */
    data: XOR<UserHospitalAccessCreateInput, UserHospitalAccessUncheckedCreateInput>
  }

  /**
   * UserHospitalAccess createMany
   */
  export type UserHospitalAccessCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserHospitalAccesses.
     */
    data: UserHospitalAccessCreateManyInput | UserHospitalAccessCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserHospitalAccess createManyAndReturn
   */
  export type UserHospitalAccessCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserHospitalAccess
     */
    select?: UserHospitalAccessSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserHospitalAccess
     */
    omit?: UserHospitalAccessOmit<ExtArgs> | null
    /**
     * The data used to create many UserHospitalAccesses.
     */
    data: UserHospitalAccessCreateManyInput | UserHospitalAccessCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserHospitalAccessIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserHospitalAccess update
   */
  export type UserHospitalAccessUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserHospitalAccess
     */
    select?: UserHospitalAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserHospitalAccess
     */
    omit?: UserHospitalAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserHospitalAccessInclude<ExtArgs> | null
    /**
     * The data needed to update a UserHospitalAccess.
     */
    data: XOR<UserHospitalAccessUpdateInput, UserHospitalAccessUncheckedUpdateInput>
    /**
     * Choose, which UserHospitalAccess to update.
     */
    where: UserHospitalAccessWhereUniqueInput
  }

  /**
   * UserHospitalAccess updateMany
   */
  export type UserHospitalAccessUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserHospitalAccesses.
     */
    data: XOR<UserHospitalAccessUpdateManyMutationInput, UserHospitalAccessUncheckedUpdateManyInput>
    /**
     * Filter which UserHospitalAccesses to update
     */
    where?: UserHospitalAccessWhereInput
    /**
     * Limit how many UserHospitalAccesses to update.
     */
    limit?: number
  }

  /**
   * UserHospitalAccess updateManyAndReturn
   */
  export type UserHospitalAccessUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserHospitalAccess
     */
    select?: UserHospitalAccessSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserHospitalAccess
     */
    omit?: UserHospitalAccessOmit<ExtArgs> | null
    /**
     * The data used to update UserHospitalAccesses.
     */
    data: XOR<UserHospitalAccessUpdateManyMutationInput, UserHospitalAccessUncheckedUpdateManyInput>
    /**
     * Filter which UserHospitalAccesses to update
     */
    where?: UserHospitalAccessWhereInput
    /**
     * Limit how many UserHospitalAccesses to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserHospitalAccessIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * UserHospitalAccess upsert
   */
  export type UserHospitalAccessUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserHospitalAccess
     */
    select?: UserHospitalAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserHospitalAccess
     */
    omit?: UserHospitalAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserHospitalAccessInclude<ExtArgs> | null
    /**
     * The filter to search for the UserHospitalAccess to update in case it exists.
     */
    where: UserHospitalAccessWhereUniqueInput
    /**
     * In case the UserHospitalAccess found by the `where` argument doesn't exist, create a new UserHospitalAccess with this data.
     */
    create: XOR<UserHospitalAccessCreateInput, UserHospitalAccessUncheckedCreateInput>
    /**
     * In case the UserHospitalAccess was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserHospitalAccessUpdateInput, UserHospitalAccessUncheckedUpdateInput>
  }

  /**
   * UserHospitalAccess delete
   */
  export type UserHospitalAccessDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserHospitalAccess
     */
    select?: UserHospitalAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserHospitalAccess
     */
    omit?: UserHospitalAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserHospitalAccessInclude<ExtArgs> | null
    /**
     * Filter which UserHospitalAccess to delete.
     */
    where: UserHospitalAccessWhereUniqueInput
  }

  /**
   * UserHospitalAccess deleteMany
   */
  export type UserHospitalAccessDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserHospitalAccesses to delete
     */
    where?: UserHospitalAccessWhereInput
    /**
     * Limit how many UserHospitalAccesses to delete.
     */
    limit?: number
  }

  /**
   * UserHospitalAccess without action
   */
  export type UserHospitalAccessDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserHospitalAccess
     */
    select?: UserHospitalAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserHospitalAccess
     */
    omit?: UserHospitalAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserHospitalAccessInclude<ExtArgs> | null
  }


  /**
   * Model Setting
   */

  export type AggregateSetting = {
    _count: SettingCountAggregateOutputType | null
    _avg: SettingAvgAggregateOutputType | null
    _sum: SettingSumAggregateOutputType | null
    _min: SettingMinAggregateOutputType | null
    _max: SettingMaxAggregateOutputType | null
  }

  export type SettingAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type SettingSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type SettingMinAggregateOutputType = {
    id: number | null
    userId: number | null
    theme: string | null
    language: string | null
  }

  export type SettingMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    theme: string | null
    language: string | null
  }

  export type SettingCountAggregateOutputType = {
    id: number
    userId: number
    theme: number
    language: number
    _all: number
  }


  export type SettingAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type SettingSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type SettingMinAggregateInputType = {
    id?: true
    userId?: true
    theme?: true
    language?: true
  }

  export type SettingMaxAggregateInputType = {
    id?: true
    userId?: true
    theme?: true
    language?: true
  }

  export type SettingCountAggregateInputType = {
    id?: true
    userId?: true
    theme?: true
    language?: true
    _all?: true
  }

  export type SettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Setting to aggregate.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Settings
    **/
    _count?: true | SettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SettingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SettingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SettingMaxAggregateInputType
  }

  export type GetSettingAggregateType<T extends SettingAggregateArgs> = {
        [P in keyof T & keyof AggregateSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSetting[P]>
      : GetScalarType<T[P], AggregateSetting[P]>
  }




  export type SettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SettingWhereInput
    orderBy?: SettingOrderByWithAggregationInput | SettingOrderByWithAggregationInput[]
    by: SettingScalarFieldEnum[] | SettingScalarFieldEnum
    having?: SettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SettingCountAggregateInputType | true
    _avg?: SettingAvgAggregateInputType
    _sum?: SettingSumAggregateInputType
    _min?: SettingMinAggregateInputType
    _max?: SettingMaxAggregateInputType
  }

  export type SettingGroupByOutputType = {
    id: number
    userId: number
    theme: string
    language: string
    _count: SettingCountAggregateOutputType | null
    _avg: SettingAvgAggregateOutputType | null
    _sum: SettingSumAggregateOutputType | null
    _min: SettingMinAggregateOutputType | null
    _max: SettingMaxAggregateOutputType | null
  }

  type GetSettingGroupByPayload<T extends SettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SettingGroupByOutputType[P]>
            : GetScalarType<T[P], SettingGroupByOutputType[P]>
        }
      >
    >


  export type SettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    theme?: boolean
    language?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["setting"]>

  export type SettingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    theme?: boolean
    language?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["setting"]>

  export type SettingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    theme?: boolean
    language?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["setting"]>

  export type SettingSelectScalar = {
    id?: boolean
    userId?: boolean
    theme?: boolean
    language?: boolean
  }

  export type SettingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "theme" | "language", ExtArgs["result"]["setting"]>
  export type SettingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SettingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type SettingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $SettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Setting"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      theme: string
      language: string
    }, ExtArgs["result"]["setting"]>
    composites: {}
  }

  type SettingGetPayload<S extends boolean | null | undefined | SettingDefaultArgs> = $Result.GetResult<Prisma.$SettingPayload, S>

  type SettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SettingCountAggregateInputType | true
    }

  export interface SettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Setting'], meta: { name: 'Setting' } }
    /**
     * Find zero or one Setting that matches the filter.
     * @param {SettingFindUniqueArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SettingFindUniqueArgs>(args: SelectSubset<T, SettingFindUniqueArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Setting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SettingFindUniqueOrThrowArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SettingFindUniqueOrThrowArgs>(args: SelectSubset<T, SettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Setting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindFirstArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SettingFindFirstArgs>(args?: SelectSubset<T, SettingFindFirstArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Setting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindFirstOrThrowArgs} args - Arguments to find a Setting
     * @example
     * // Get one Setting
     * const setting = await prisma.setting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SettingFindFirstOrThrowArgs>(args?: SelectSubset<T, SettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Settings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Settings
     * const settings = await prisma.setting.findMany()
     * 
     * // Get first 10 Settings
     * const settings = await prisma.setting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const settingWithIdOnly = await prisma.setting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SettingFindManyArgs>(args?: SelectSubset<T, SettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Setting.
     * @param {SettingCreateArgs} args - Arguments to create a Setting.
     * @example
     * // Create one Setting
     * const Setting = await prisma.setting.create({
     *   data: {
     *     // ... data to create a Setting
     *   }
     * })
     * 
     */
    create<T extends SettingCreateArgs>(args: SelectSubset<T, SettingCreateArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Settings.
     * @param {SettingCreateManyArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const setting = await prisma.setting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SettingCreateManyArgs>(args?: SelectSubset<T, SettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Settings and returns the data saved in the database.
     * @param {SettingCreateManyAndReturnArgs} args - Arguments to create many Settings.
     * @example
     * // Create many Settings
     * const setting = await prisma.setting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Settings and only return the `id`
     * const settingWithIdOnly = await prisma.setting.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SettingCreateManyAndReturnArgs>(args?: SelectSubset<T, SettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Setting.
     * @param {SettingDeleteArgs} args - Arguments to delete one Setting.
     * @example
     * // Delete one Setting
     * const Setting = await prisma.setting.delete({
     *   where: {
     *     // ... filter to delete one Setting
     *   }
     * })
     * 
     */
    delete<T extends SettingDeleteArgs>(args: SelectSubset<T, SettingDeleteArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Setting.
     * @param {SettingUpdateArgs} args - Arguments to update one Setting.
     * @example
     * // Update one Setting
     * const setting = await prisma.setting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SettingUpdateArgs>(args: SelectSubset<T, SettingUpdateArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Settings.
     * @param {SettingDeleteManyArgs} args - Arguments to filter Settings to delete.
     * @example
     * // Delete a few Settings
     * const { count } = await prisma.setting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SettingDeleteManyArgs>(args?: SelectSubset<T, SettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Settings
     * const setting = await prisma.setting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SettingUpdateManyArgs>(args: SelectSubset<T, SettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Settings and returns the data updated in the database.
     * @param {SettingUpdateManyAndReturnArgs} args - Arguments to update many Settings.
     * @example
     * // Update many Settings
     * const setting = await prisma.setting.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Settings and only return the `id`
     * const settingWithIdOnly = await prisma.setting.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SettingUpdateManyAndReturnArgs>(args: SelectSubset<T, SettingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Setting.
     * @param {SettingUpsertArgs} args - Arguments to update or create a Setting.
     * @example
     * // Update or create a Setting
     * const setting = await prisma.setting.upsert({
     *   create: {
     *     // ... data to create a Setting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Setting we want to update
     *   }
     * })
     */
    upsert<T extends SettingUpsertArgs>(args: SelectSubset<T, SettingUpsertArgs<ExtArgs>>): Prisma__SettingClient<$Result.GetResult<Prisma.$SettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Settings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingCountArgs} args - Arguments to filter Settings to count.
     * @example
     * // Count the number of Settings
     * const count = await prisma.setting.count({
     *   where: {
     *     // ... the filter for the Settings we want to count
     *   }
     * })
    **/
    count<T extends SettingCountArgs>(
      args?: Subset<T, SettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Setting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SettingAggregateArgs>(args: Subset<T, SettingAggregateArgs>): Prisma.PrismaPromise<GetSettingAggregateType<T>>

    /**
     * Group by Setting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SettingGroupByArgs['orderBy'] }
        : { orderBy?: SettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Setting model
   */
  readonly fields: SettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Setting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Setting model
   */
  interface SettingFieldRefs {
    readonly id: FieldRef<"Setting", 'Int'>
    readonly userId: FieldRef<"Setting", 'Int'>
    readonly theme: FieldRef<"Setting", 'String'>
    readonly language: FieldRef<"Setting", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Setting findUnique
   */
  export type SettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingInclude<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting findUniqueOrThrow
   */
  export type SettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingInclude<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting findFirst
   */
  export type SettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingInclude<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[]
  }

  /**
   * Setting findFirstOrThrow
   */
  export type SettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingInclude<ExtArgs> | null
    /**
     * Filter, which Setting to fetch.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Settings.
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Settings.
     */
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[]
  }

  /**
   * Setting findMany
   */
  export type SettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingInclude<ExtArgs> | null
    /**
     * Filter, which Settings to fetch.
     */
    where?: SettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Settings to fetch.
     */
    orderBy?: SettingOrderByWithRelationInput | SettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Settings.
     */
    cursor?: SettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Settings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Settings.
     */
    skip?: number
    distinct?: SettingScalarFieldEnum | SettingScalarFieldEnum[]
  }

  /**
   * Setting create
   */
  export type SettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingInclude<ExtArgs> | null
    /**
     * The data needed to create a Setting.
     */
    data: XOR<SettingCreateInput, SettingUncheckedCreateInput>
  }

  /**
   * Setting createMany
   */
  export type SettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Settings.
     */
    data: SettingCreateManyInput | SettingCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Setting createManyAndReturn
   */
  export type SettingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The data used to create many Settings.
     */
    data: SettingCreateManyInput | SettingCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Setting update
   */
  export type SettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingInclude<ExtArgs> | null
    /**
     * The data needed to update a Setting.
     */
    data: XOR<SettingUpdateInput, SettingUncheckedUpdateInput>
    /**
     * Choose, which Setting to update.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting updateMany
   */
  export type SettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingUpdateManyMutationInput, SettingUncheckedUpdateManyInput>
    /**
     * Filter which Settings to update
     */
    where?: SettingWhereInput
    /**
     * Limit how many Settings to update.
     */
    limit?: number
  }

  /**
   * Setting updateManyAndReturn
   */
  export type SettingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * The data used to update Settings.
     */
    data: XOR<SettingUpdateManyMutationInput, SettingUncheckedUpdateManyInput>
    /**
     * Filter which Settings to update
     */
    where?: SettingWhereInput
    /**
     * Limit how many Settings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Setting upsert
   */
  export type SettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingInclude<ExtArgs> | null
    /**
     * The filter to search for the Setting to update in case it exists.
     */
    where: SettingWhereUniqueInput
    /**
     * In case the Setting found by the `where` argument doesn't exist, create a new Setting with this data.
     */
    create: XOR<SettingCreateInput, SettingUncheckedCreateInput>
    /**
     * In case the Setting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SettingUpdateInput, SettingUncheckedUpdateInput>
  }

  /**
   * Setting delete
   */
  export type SettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingInclude<ExtArgs> | null
    /**
     * Filter which Setting to delete.
     */
    where: SettingWhereUniqueInput
  }

  /**
   * Setting deleteMany
   */
  export type SettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Settings to delete
     */
    where?: SettingWhereInput
    /**
     * Limit how many Settings to delete.
     */
    limit?: number
  }

  /**
   * Setting without action
   */
  export type SettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Setting
     */
    select?: SettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Setting
     */
    omit?: SettingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SettingInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _avg: AuditLogAvgAggregateOutputType | null
    _sum: AuditLogSumAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    entityId: number | null
  }

  export type AuditLogSumAggregateOutputType = {
    id: number | null
    userId: number | null
    entityId: number | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: number | null
    userId: number | null
    action: string | null
    entity: string | null
    entityId: number | null
    timestamp: Date | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    action: string | null
    entity: string | null
    entityId: number | null
    timestamp: Date | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    userId: number
    action: number
    entity: number
    entityId: number
    timestamp: number
    metadata: number
    _all: number
  }


  export type AuditLogAvgAggregateInputType = {
    id?: true
    userId?: true
    entityId?: true
  }

  export type AuditLogSumAggregateInputType = {
    id?: true
    userId?: true
    entityId?: true
  }

  export type AuditLogMinAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    entity?: true
    entityId?: true
    timestamp?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    entity?: true
    entityId?: true
    timestamp?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    userId?: true
    action?: true
    entity?: true
    entityId?: true
    timestamp?: true
    metadata?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AuditLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AuditLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _avg?: AuditLogAvgAggregateInputType
    _sum?: AuditLogSumAggregateInputType
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: number
    userId: number | null
    action: string
    entity: string
    entityId: number | null
    timestamp: Date
    metadata: JsonValue | null
    _count: AuditLogCountAggregateOutputType | null
    _avg: AuditLogAvgAggregateOutputType | null
    _sum: AuditLogSumAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    entity?: boolean
    entityId?: boolean
    timestamp?: boolean
    metadata?: boolean
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    entity?: boolean
    entityId?: boolean
    timestamp?: boolean
    metadata?: boolean
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    action?: boolean
    entity?: boolean
    entityId?: boolean
    timestamp?: boolean
    metadata?: boolean
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    userId?: boolean
    action?: boolean
    entity?: boolean
    entityId?: boolean
    timestamp?: boolean
    metadata?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "action" | "entity" | "entityId" | "timestamp" | "metadata", ExtArgs["result"]["auditLog"]>
  export type AuditLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }
  export type AuditLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }
  export type AuditLogIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | AuditLog$userArgs<ExtArgs>
  }

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {
      user: Prisma.$UserPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number | null
      action: string
      entity: string
      entityId: number | null
      timestamp: Date
      metadata: Prisma.JsonValue | null
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends AuditLog$userArgs<ExtArgs> = {}>(args?: Subset<T, AuditLog$userArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'Int'>
    readonly userId: FieldRef<"AuditLog", 'Int'>
    readonly action: FieldRef<"AuditLog", 'String'>
    readonly entity: FieldRef<"AuditLog", 'String'>
    readonly entityId: FieldRef<"AuditLog", 'Int'>
    readonly timestamp: FieldRef<"AuditLog", 'DateTime'>
    readonly metadata: FieldRef<"AuditLog", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog.user
   */
  export type AuditLog$userArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AuditLogInclude<ExtArgs> | null
  }


  /**
   * Model LoginSession
   */

  export type AggregateLoginSession = {
    _count: LoginSessionCountAggregateOutputType | null
    _avg: LoginSessionAvgAggregateOutputType | null
    _sum: LoginSessionSumAggregateOutputType | null
    _min: LoginSessionMinAggregateOutputType | null
    _max: LoginSessionMaxAggregateOutputType | null
  }

  export type LoginSessionAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type LoginSessionSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type LoginSessionMinAggregateOutputType = {
    id: number | null
    userId: number | null
    ipAddress: string | null
    userAgent: string | null
    loginAt: Date | null
  }

  export type LoginSessionMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    ipAddress: string | null
    userAgent: string | null
    loginAt: Date | null
  }

  export type LoginSessionCountAggregateOutputType = {
    id: number
    userId: number
    ipAddress: number
    userAgent: number
    loginAt: number
    _all: number
  }


  export type LoginSessionAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type LoginSessionSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type LoginSessionMinAggregateInputType = {
    id?: true
    userId?: true
    ipAddress?: true
    userAgent?: true
    loginAt?: true
  }

  export type LoginSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    ipAddress?: true
    userAgent?: true
    loginAt?: true
  }

  export type LoginSessionCountAggregateInputType = {
    id?: true
    userId?: true
    ipAddress?: true
    userAgent?: true
    loginAt?: true
    _all?: true
  }

  export type LoginSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoginSession to aggregate.
     */
    where?: LoginSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginSessions to fetch.
     */
    orderBy?: LoginSessionOrderByWithRelationInput | LoginSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LoginSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LoginSessions
    **/
    _count?: true | LoginSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LoginSessionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LoginSessionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LoginSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LoginSessionMaxAggregateInputType
  }

  export type GetLoginSessionAggregateType<T extends LoginSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateLoginSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLoginSession[P]>
      : GetScalarType<T[P], AggregateLoginSession[P]>
  }




  export type LoginSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LoginSessionWhereInput
    orderBy?: LoginSessionOrderByWithAggregationInput | LoginSessionOrderByWithAggregationInput[]
    by: LoginSessionScalarFieldEnum[] | LoginSessionScalarFieldEnum
    having?: LoginSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LoginSessionCountAggregateInputType | true
    _avg?: LoginSessionAvgAggregateInputType
    _sum?: LoginSessionSumAggregateInputType
    _min?: LoginSessionMinAggregateInputType
    _max?: LoginSessionMaxAggregateInputType
  }

  export type LoginSessionGroupByOutputType = {
    id: number
    userId: number
    ipAddress: string
    userAgent: string
    loginAt: Date
    _count: LoginSessionCountAggregateOutputType | null
    _avg: LoginSessionAvgAggregateOutputType | null
    _sum: LoginSessionSumAggregateOutputType | null
    _min: LoginSessionMinAggregateOutputType | null
    _max: LoginSessionMaxAggregateOutputType | null
  }

  type GetLoginSessionGroupByPayload<T extends LoginSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LoginSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LoginSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LoginSessionGroupByOutputType[P]>
            : GetScalarType<T[P], LoginSessionGroupByOutputType[P]>
        }
      >
    >


  export type LoginSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    loginAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loginSession"]>

  export type LoginSessionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    loginAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loginSession"]>

  export type LoginSessionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    loginAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["loginSession"]>

  export type LoginSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    ipAddress?: boolean
    userAgent?: boolean
    loginAt?: boolean
  }

  export type LoginSessionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "ipAddress" | "userAgent" | "loginAt", ExtArgs["result"]["loginSession"]>
  export type LoginSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type LoginSessionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type LoginSessionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $LoginSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LoginSession"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      ipAddress: string
      userAgent: string
      loginAt: Date
    }, ExtArgs["result"]["loginSession"]>
    composites: {}
  }

  type LoginSessionGetPayload<S extends boolean | null | undefined | LoginSessionDefaultArgs> = $Result.GetResult<Prisma.$LoginSessionPayload, S>

  type LoginSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LoginSessionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LoginSessionCountAggregateInputType | true
    }

  export interface LoginSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LoginSession'], meta: { name: 'LoginSession' } }
    /**
     * Find zero or one LoginSession that matches the filter.
     * @param {LoginSessionFindUniqueArgs} args - Arguments to find a LoginSession
     * @example
     * // Get one LoginSession
     * const loginSession = await prisma.loginSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LoginSessionFindUniqueArgs>(args: SelectSubset<T, LoginSessionFindUniqueArgs<ExtArgs>>): Prisma__LoginSessionClient<$Result.GetResult<Prisma.$LoginSessionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LoginSession that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LoginSessionFindUniqueOrThrowArgs} args - Arguments to find a LoginSession
     * @example
     * // Get one LoginSession
     * const loginSession = await prisma.loginSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LoginSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, LoginSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LoginSessionClient<$Result.GetResult<Prisma.$LoginSessionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoginSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginSessionFindFirstArgs} args - Arguments to find a LoginSession
     * @example
     * // Get one LoginSession
     * const loginSession = await prisma.loginSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LoginSessionFindFirstArgs>(args?: SelectSubset<T, LoginSessionFindFirstArgs<ExtArgs>>): Prisma__LoginSessionClient<$Result.GetResult<Prisma.$LoginSessionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LoginSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginSessionFindFirstOrThrowArgs} args - Arguments to find a LoginSession
     * @example
     * // Get one LoginSession
     * const loginSession = await prisma.loginSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LoginSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, LoginSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__LoginSessionClient<$Result.GetResult<Prisma.$LoginSessionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LoginSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LoginSessions
     * const loginSessions = await prisma.loginSession.findMany()
     * 
     * // Get first 10 LoginSessions
     * const loginSessions = await prisma.loginSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const loginSessionWithIdOnly = await prisma.loginSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LoginSessionFindManyArgs>(args?: SelectSubset<T, LoginSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginSessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LoginSession.
     * @param {LoginSessionCreateArgs} args - Arguments to create a LoginSession.
     * @example
     * // Create one LoginSession
     * const LoginSession = await prisma.loginSession.create({
     *   data: {
     *     // ... data to create a LoginSession
     *   }
     * })
     * 
     */
    create<T extends LoginSessionCreateArgs>(args: SelectSubset<T, LoginSessionCreateArgs<ExtArgs>>): Prisma__LoginSessionClient<$Result.GetResult<Prisma.$LoginSessionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LoginSessions.
     * @param {LoginSessionCreateManyArgs} args - Arguments to create many LoginSessions.
     * @example
     * // Create many LoginSessions
     * const loginSession = await prisma.loginSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LoginSessionCreateManyArgs>(args?: SelectSubset<T, LoginSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LoginSessions and returns the data saved in the database.
     * @param {LoginSessionCreateManyAndReturnArgs} args - Arguments to create many LoginSessions.
     * @example
     * // Create many LoginSessions
     * const loginSession = await prisma.loginSession.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LoginSessions and only return the `id`
     * const loginSessionWithIdOnly = await prisma.loginSession.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LoginSessionCreateManyAndReturnArgs>(args?: SelectSubset<T, LoginSessionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginSessionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LoginSession.
     * @param {LoginSessionDeleteArgs} args - Arguments to delete one LoginSession.
     * @example
     * // Delete one LoginSession
     * const LoginSession = await prisma.loginSession.delete({
     *   where: {
     *     // ... filter to delete one LoginSession
     *   }
     * })
     * 
     */
    delete<T extends LoginSessionDeleteArgs>(args: SelectSubset<T, LoginSessionDeleteArgs<ExtArgs>>): Prisma__LoginSessionClient<$Result.GetResult<Prisma.$LoginSessionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LoginSession.
     * @param {LoginSessionUpdateArgs} args - Arguments to update one LoginSession.
     * @example
     * // Update one LoginSession
     * const loginSession = await prisma.loginSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LoginSessionUpdateArgs>(args: SelectSubset<T, LoginSessionUpdateArgs<ExtArgs>>): Prisma__LoginSessionClient<$Result.GetResult<Prisma.$LoginSessionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LoginSessions.
     * @param {LoginSessionDeleteManyArgs} args - Arguments to filter LoginSessions to delete.
     * @example
     * // Delete a few LoginSessions
     * const { count } = await prisma.loginSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LoginSessionDeleteManyArgs>(args?: SelectSubset<T, LoginSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoginSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LoginSessions
     * const loginSession = await prisma.loginSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LoginSessionUpdateManyArgs>(args: SelectSubset<T, LoginSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LoginSessions and returns the data updated in the database.
     * @param {LoginSessionUpdateManyAndReturnArgs} args - Arguments to update many LoginSessions.
     * @example
     * // Update many LoginSessions
     * const loginSession = await prisma.loginSession.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LoginSessions and only return the `id`
     * const loginSessionWithIdOnly = await prisma.loginSession.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LoginSessionUpdateManyAndReturnArgs>(args: SelectSubset<T, LoginSessionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LoginSessionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LoginSession.
     * @param {LoginSessionUpsertArgs} args - Arguments to update or create a LoginSession.
     * @example
     * // Update or create a LoginSession
     * const loginSession = await prisma.loginSession.upsert({
     *   create: {
     *     // ... data to create a LoginSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LoginSession we want to update
     *   }
     * })
     */
    upsert<T extends LoginSessionUpsertArgs>(args: SelectSubset<T, LoginSessionUpsertArgs<ExtArgs>>): Prisma__LoginSessionClient<$Result.GetResult<Prisma.$LoginSessionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LoginSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginSessionCountArgs} args - Arguments to filter LoginSessions to count.
     * @example
     * // Count the number of LoginSessions
     * const count = await prisma.loginSession.count({
     *   where: {
     *     // ... the filter for the LoginSessions we want to count
     *   }
     * })
    **/
    count<T extends LoginSessionCountArgs>(
      args?: Subset<T, LoginSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LoginSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LoginSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LoginSessionAggregateArgs>(args: Subset<T, LoginSessionAggregateArgs>): Prisma.PrismaPromise<GetLoginSessionAggregateType<T>>

    /**
     * Group by LoginSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LoginSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LoginSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LoginSessionGroupByArgs['orderBy'] }
        : { orderBy?: LoginSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LoginSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLoginSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LoginSession model
   */
  readonly fields: LoginSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LoginSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LoginSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LoginSession model
   */
  interface LoginSessionFieldRefs {
    readonly id: FieldRef<"LoginSession", 'Int'>
    readonly userId: FieldRef<"LoginSession", 'Int'>
    readonly ipAddress: FieldRef<"LoginSession", 'String'>
    readonly userAgent: FieldRef<"LoginSession", 'String'>
    readonly loginAt: FieldRef<"LoginSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LoginSession findUnique
   */
  export type LoginSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginSession
     */
    select?: LoginSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginSession
     */
    omit?: LoginSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginSessionInclude<ExtArgs> | null
    /**
     * Filter, which LoginSession to fetch.
     */
    where: LoginSessionWhereUniqueInput
  }

  /**
   * LoginSession findUniqueOrThrow
   */
  export type LoginSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginSession
     */
    select?: LoginSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginSession
     */
    omit?: LoginSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginSessionInclude<ExtArgs> | null
    /**
     * Filter, which LoginSession to fetch.
     */
    where: LoginSessionWhereUniqueInput
  }

  /**
   * LoginSession findFirst
   */
  export type LoginSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginSession
     */
    select?: LoginSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginSession
     */
    omit?: LoginSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginSessionInclude<ExtArgs> | null
    /**
     * Filter, which LoginSession to fetch.
     */
    where?: LoginSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginSessions to fetch.
     */
    orderBy?: LoginSessionOrderByWithRelationInput | LoginSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoginSessions.
     */
    cursor?: LoginSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoginSessions.
     */
    distinct?: LoginSessionScalarFieldEnum | LoginSessionScalarFieldEnum[]
  }

  /**
   * LoginSession findFirstOrThrow
   */
  export type LoginSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginSession
     */
    select?: LoginSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginSession
     */
    omit?: LoginSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginSessionInclude<ExtArgs> | null
    /**
     * Filter, which LoginSession to fetch.
     */
    where?: LoginSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginSessions to fetch.
     */
    orderBy?: LoginSessionOrderByWithRelationInput | LoginSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LoginSessions.
     */
    cursor?: LoginSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LoginSessions.
     */
    distinct?: LoginSessionScalarFieldEnum | LoginSessionScalarFieldEnum[]
  }

  /**
   * LoginSession findMany
   */
  export type LoginSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginSession
     */
    select?: LoginSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginSession
     */
    omit?: LoginSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginSessionInclude<ExtArgs> | null
    /**
     * Filter, which LoginSessions to fetch.
     */
    where?: LoginSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LoginSessions to fetch.
     */
    orderBy?: LoginSessionOrderByWithRelationInput | LoginSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LoginSessions.
     */
    cursor?: LoginSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LoginSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LoginSessions.
     */
    skip?: number
    distinct?: LoginSessionScalarFieldEnum | LoginSessionScalarFieldEnum[]
  }

  /**
   * LoginSession create
   */
  export type LoginSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginSession
     */
    select?: LoginSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginSession
     */
    omit?: LoginSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a LoginSession.
     */
    data: XOR<LoginSessionCreateInput, LoginSessionUncheckedCreateInput>
  }

  /**
   * LoginSession createMany
   */
  export type LoginSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LoginSessions.
     */
    data: LoginSessionCreateManyInput | LoginSessionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LoginSession createManyAndReturn
   */
  export type LoginSessionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginSession
     */
    select?: LoginSessionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoginSession
     */
    omit?: LoginSessionOmit<ExtArgs> | null
    /**
     * The data used to create many LoginSessions.
     */
    data: LoginSessionCreateManyInput | LoginSessionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginSessionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LoginSession update
   */
  export type LoginSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginSession
     */
    select?: LoginSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginSession
     */
    omit?: LoginSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a LoginSession.
     */
    data: XOR<LoginSessionUpdateInput, LoginSessionUncheckedUpdateInput>
    /**
     * Choose, which LoginSession to update.
     */
    where: LoginSessionWhereUniqueInput
  }

  /**
   * LoginSession updateMany
   */
  export type LoginSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LoginSessions.
     */
    data: XOR<LoginSessionUpdateManyMutationInput, LoginSessionUncheckedUpdateManyInput>
    /**
     * Filter which LoginSessions to update
     */
    where?: LoginSessionWhereInput
    /**
     * Limit how many LoginSessions to update.
     */
    limit?: number
  }

  /**
   * LoginSession updateManyAndReturn
   */
  export type LoginSessionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginSession
     */
    select?: LoginSessionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LoginSession
     */
    omit?: LoginSessionOmit<ExtArgs> | null
    /**
     * The data used to update LoginSessions.
     */
    data: XOR<LoginSessionUpdateManyMutationInput, LoginSessionUncheckedUpdateManyInput>
    /**
     * Filter which LoginSessions to update
     */
    where?: LoginSessionWhereInput
    /**
     * Limit how many LoginSessions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginSessionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LoginSession upsert
   */
  export type LoginSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginSession
     */
    select?: LoginSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginSession
     */
    omit?: LoginSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the LoginSession to update in case it exists.
     */
    where: LoginSessionWhereUniqueInput
    /**
     * In case the LoginSession found by the `where` argument doesn't exist, create a new LoginSession with this data.
     */
    create: XOR<LoginSessionCreateInput, LoginSessionUncheckedCreateInput>
    /**
     * In case the LoginSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LoginSessionUpdateInput, LoginSessionUncheckedUpdateInput>
  }

  /**
   * LoginSession delete
   */
  export type LoginSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginSession
     */
    select?: LoginSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginSession
     */
    omit?: LoginSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginSessionInclude<ExtArgs> | null
    /**
     * Filter which LoginSession to delete.
     */
    where: LoginSessionWhereUniqueInput
  }

  /**
   * LoginSession deleteMany
   */
  export type LoginSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LoginSessions to delete
     */
    where?: LoginSessionWhereInput
    /**
     * Limit how many LoginSessions to delete.
     */
    limit?: number
  }

  /**
   * LoginSession without action
   */
  export type LoginSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LoginSession
     */
    select?: LoginSessionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LoginSession
     */
    omit?: LoginSessionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LoginSessionInclude<ExtArgs> | null
  }


  /**
   * Model Role
   */

  export type AggregateRole = {
    _count: RoleCountAggregateOutputType | null
    _avg: RoleAvgAggregateOutputType | null
    _sum: RoleSumAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  export type RoleAvgAggregateOutputType = {
    id: number | null
  }

  export type RoleSumAggregateOutputType = {
    id: number | null
  }

  export type RoleMinAggregateOutputType = {
    id: number | null
    Rolename: string | null
    description: string | null
    isActive: boolean | null
  }

  export type RoleMaxAggregateOutputType = {
    id: number | null
    Rolename: string | null
    description: string | null
    isActive: boolean | null
  }

  export type RoleCountAggregateOutputType = {
    id: number
    Rolename: number
    description: number
    isActive: number
    _all: number
  }


  export type RoleAvgAggregateInputType = {
    id?: true
  }

  export type RoleSumAggregateInputType = {
    id?: true
  }

  export type RoleMinAggregateInputType = {
    id?: true
    Rolename?: true
    description?: true
    isActive?: true
  }

  export type RoleMaxAggregateInputType = {
    id?: true
    Rolename?: true
    description?: true
    isActive?: true
  }

  export type RoleCountAggregateInputType = {
    id?: true
    Rolename?: true
    description?: true
    isActive?: true
    _all?: true
  }

  export type RoleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Role to aggregate.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Roles
    **/
    _count?: true | RoleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RoleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RoleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RoleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RoleMaxAggregateInputType
  }

  export type GetRoleAggregateType<T extends RoleAggregateArgs> = {
        [P in keyof T & keyof AggregateRole]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRole[P]>
      : GetScalarType<T[P], AggregateRole[P]>
  }




  export type RoleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RoleWhereInput
    orderBy?: RoleOrderByWithAggregationInput | RoleOrderByWithAggregationInput[]
    by: RoleScalarFieldEnum[] | RoleScalarFieldEnum
    having?: RoleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RoleCountAggregateInputType | true
    _avg?: RoleAvgAggregateInputType
    _sum?: RoleSumAggregateInputType
    _min?: RoleMinAggregateInputType
    _max?: RoleMaxAggregateInputType
  }

  export type RoleGroupByOutputType = {
    id: number
    Rolename: string
    description: string
    isActive: boolean
    _count: RoleCountAggregateOutputType | null
    _avg: RoleAvgAggregateOutputType | null
    _sum: RoleSumAggregateOutputType | null
    _min: RoleMinAggregateOutputType | null
    _max: RoleMaxAggregateOutputType | null
  }

  type GetRoleGroupByPayload<T extends RoleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RoleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RoleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RoleGroupByOutputType[P]>
            : GetScalarType<T[P], RoleGroupByOutputType[P]>
        }
      >
    >


  export type RoleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    Rolename?: boolean
    description?: boolean
    isActive?: boolean
    users?: boolean | Role$usersArgs<ExtArgs>
    UserHospitalAccess?: boolean | Role$UserHospitalAccessArgs<ExtArgs>
    permissions?: boolean | Role$permissionsArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["role"]>

  export type RoleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    Rolename?: boolean
    description?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    Rolename?: boolean
    description?: boolean
    isActive?: boolean
  }, ExtArgs["result"]["role"]>

  export type RoleSelectScalar = {
    id?: boolean
    Rolename?: boolean
    description?: boolean
    isActive?: boolean
  }

  export type RoleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "Rolename" | "description" | "isActive", ExtArgs["result"]["role"]>
  export type RoleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Role$usersArgs<ExtArgs>
    UserHospitalAccess?: boolean | Role$UserHospitalAccessArgs<ExtArgs>
    permissions?: boolean | Role$permissionsArgs<ExtArgs>
    _count?: boolean | RoleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type RoleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type RoleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $RolePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Role"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
      UserHospitalAccess: Prisma.$UserHospitalAccessPayload<ExtArgs>[]
      permissions: Prisma.$RolePermissionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      Rolename: string
      description: string
      isActive: boolean
    }, ExtArgs["result"]["role"]>
    composites: {}
  }

  type RoleGetPayload<S extends boolean | null | undefined | RoleDefaultArgs> = $Result.GetResult<Prisma.$RolePayload, S>

  type RoleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RoleCountAggregateInputType | true
    }

  export interface RoleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Role'], meta: { name: 'Role' } }
    /**
     * Find zero or one Role that matches the filter.
     * @param {RoleFindUniqueArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RoleFindUniqueArgs>(args: SelectSubset<T, RoleFindUniqueArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Role that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RoleFindUniqueOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RoleFindUniqueOrThrowArgs>(args: SelectSubset<T, RoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RoleFindFirstArgs>(args?: SelectSubset<T, RoleFindFirstArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Role that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindFirstOrThrowArgs} args - Arguments to find a Role
     * @example
     * // Get one Role
     * const role = await prisma.role.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RoleFindFirstOrThrowArgs>(args?: SelectSubset<T, RoleFindFirstOrThrowArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Roles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Roles
     * const roles = await prisma.role.findMany()
     * 
     * // Get first 10 Roles
     * const roles = await prisma.role.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const roleWithIdOnly = await prisma.role.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RoleFindManyArgs>(args?: SelectSubset<T, RoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Role.
     * @param {RoleCreateArgs} args - Arguments to create a Role.
     * @example
     * // Create one Role
     * const Role = await prisma.role.create({
     *   data: {
     *     // ... data to create a Role
     *   }
     * })
     * 
     */
    create<T extends RoleCreateArgs>(args: SelectSubset<T, RoleCreateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Roles.
     * @param {RoleCreateManyArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RoleCreateManyArgs>(args?: SelectSubset<T, RoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Roles and returns the data saved in the database.
     * @param {RoleCreateManyAndReturnArgs} args - Arguments to create many Roles.
     * @example
     * // Create many Roles
     * const role = await prisma.role.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RoleCreateManyAndReturnArgs>(args?: SelectSubset<T, RoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Role.
     * @param {RoleDeleteArgs} args - Arguments to delete one Role.
     * @example
     * // Delete one Role
     * const Role = await prisma.role.delete({
     *   where: {
     *     // ... filter to delete one Role
     *   }
     * })
     * 
     */
    delete<T extends RoleDeleteArgs>(args: SelectSubset<T, RoleDeleteArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Role.
     * @param {RoleUpdateArgs} args - Arguments to update one Role.
     * @example
     * // Update one Role
     * const role = await prisma.role.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RoleUpdateArgs>(args: SelectSubset<T, RoleUpdateArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Roles.
     * @param {RoleDeleteManyArgs} args - Arguments to filter Roles to delete.
     * @example
     * // Delete a few Roles
     * const { count } = await prisma.role.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RoleDeleteManyArgs>(args?: SelectSubset<T, RoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RoleUpdateManyArgs>(args: SelectSubset<T, RoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Roles and returns the data updated in the database.
     * @param {RoleUpdateManyAndReturnArgs} args - Arguments to update many Roles.
     * @example
     * // Update many Roles
     * const role = await prisma.role.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Roles and only return the `id`
     * const roleWithIdOnly = await prisma.role.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RoleUpdateManyAndReturnArgs>(args: SelectSubset<T, RoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Role.
     * @param {RoleUpsertArgs} args - Arguments to update or create a Role.
     * @example
     * // Update or create a Role
     * const role = await prisma.role.upsert({
     *   create: {
     *     // ... data to create a Role
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Role we want to update
     *   }
     * })
     */
    upsert<T extends RoleUpsertArgs>(args: SelectSubset<T, RoleUpsertArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Roles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleCountArgs} args - Arguments to filter Roles to count.
     * @example
     * // Count the number of Roles
     * const count = await prisma.role.count({
     *   where: {
     *     // ... the filter for the Roles we want to count
     *   }
     * })
    **/
    count<T extends RoleCountArgs>(
      args?: Subset<T, RoleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RoleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RoleAggregateArgs>(args: Subset<T, RoleAggregateArgs>): Prisma.PrismaPromise<GetRoleAggregateType<T>>

    /**
     * Group by Role.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RoleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RoleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RoleGroupByArgs['orderBy'] }
        : { orderBy?: RoleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Role model
   */
  readonly fields: RoleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Role.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RoleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Role$usersArgs<ExtArgs> = {}>(args?: Subset<T, Role$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    UserHospitalAccess<T extends Role$UserHospitalAccessArgs<ExtArgs> = {}>(args?: Subset<T, Role$UserHospitalAccessArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserHospitalAccessPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    permissions<T extends Role$permissionsArgs<ExtArgs> = {}>(args?: Subset<T, Role$permissionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Role model
   */
  interface RoleFieldRefs {
    readonly id: FieldRef<"Role", 'Int'>
    readonly Rolename: FieldRef<"Role", 'String'>
    readonly description: FieldRef<"Role", 'String'>
    readonly isActive: FieldRef<"Role", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * Role findUnique
   */
  export type RoleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findUniqueOrThrow
   */
  export type RoleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role findFirst
   */
  export type RoleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findFirstOrThrow
   */
  export type RoleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Role to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Roles.
     */
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role findMany
   */
  export type RoleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter, which Roles to fetch.
     */
    where?: RoleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Roles to fetch.
     */
    orderBy?: RoleOrderByWithRelationInput | RoleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Roles.
     */
    cursor?: RoleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Roles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Roles.
     */
    skip?: number
    distinct?: RoleScalarFieldEnum | RoleScalarFieldEnum[]
  }

  /**
   * Role create
   */
  export type RoleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to create a Role.
     */
    data: XOR<RoleCreateInput, RoleUncheckedCreateInput>
  }

  /**
   * Role createMany
   */
  export type RoleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role createManyAndReturn
   */
  export type RoleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data used to create many Roles.
     */
    data: RoleCreateManyInput | RoleCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Role update
   */
  export type RoleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The data needed to update a Role.
     */
    data: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
    /**
     * Choose, which Role to update.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role updateMany
   */
  export type RoleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role updateManyAndReturn
   */
  export type RoleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * The data used to update Roles.
     */
    data: XOR<RoleUpdateManyMutationInput, RoleUncheckedUpdateManyInput>
    /**
     * Filter which Roles to update
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to update.
     */
    limit?: number
  }

  /**
   * Role upsert
   */
  export type RoleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * The filter to search for the Role to update in case it exists.
     */
    where: RoleWhereUniqueInput
    /**
     * In case the Role found by the `where` argument doesn't exist, create a new Role with this data.
     */
    create: XOR<RoleCreateInput, RoleUncheckedCreateInput>
    /**
     * In case the Role was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RoleUpdateInput, RoleUncheckedUpdateInput>
  }

  /**
   * Role delete
   */
  export type RoleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
    /**
     * Filter which Role to delete.
     */
    where: RoleWhereUniqueInput
  }

  /**
   * Role deleteMany
   */
  export type RoleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Roles to delete
     */
    where?: RoleWhereInput
    /**
     * Limit how many Roles to delete.
     */
    limit?: number
  }

  /**
   * Role.users
   */
  export type Role$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Role.UserHospitalAccess
   */
  export type Role$UserHospitalAccessArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserHospitalAccess
     */
    select?: UserHospitalAccessSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserHospitalAccess
     */
    omit?: UserHospitalAccessOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserHospitalAccessInclude<ExtArgs> | null
    where?: UserHospitalAccessWhereInput
    orderBy?: UserHospitalAccessOrderByWithRelationInput | UserHospitalAccessOrderByWithRelationInput[]
    cursor?: UserHospitalAccessWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserHospitalAccessScalarFieldEnum | UserHospitalAccessScalarFieldEnum[]
  }

  /**
   * Role.permissions
   */
  export type Role$permissionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    where?: RolePermissionWhereInput
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    cursor?: RolePermissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * Role without action
   */
  export type RoleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Role
     */
    select?: RoleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Role
     */
    omit?: RoleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RoleInclude<ExtArgs> | null
  }


  /**
   * Model RolePermission
   */

  export type AggregateRolePermission = {
    _count: RolePermissionCountAggregateOutputType | null
    _avg: RolePermissionAvgAggregateOutputType | null
    _sum: RolePermissionSumAggregateOutputType | null
    _min: RolePermissionMinAggregateOutputType | null
    _max: RolePermissionMaxAggregateOutputType | null
  }

  export type RolePermissionAvgAggregateOutputType = {
    id: number | null
    roleId: number | null
    permissionId: number | null
  }

  export type RolePermissionSumAggregateOutputType = {
    id: number | null
    roleId: number | null
    permissionId: number | null
  }

  export type RolePermissionMinAggregateOutputType = {
    id: number | null
    roleId: number | null
    permissionId: number | null
  }

  export type RolePermissionMaxAggregateOutputType = {
    id: number | null
    roleId: number | null
    permissionId: number | null
  }

  export type RolePermissionCountAggregateOutputType = {
    id: number
    roleId: number
    permissionId: number
    _all: number
  }


  export type RolePermissionAvgAggregateInputType = {
    id?: true
    roleId?: true
    permissionId?: true
  }

  export type RolePermissionSumAggregateInputType = {
    id?: true
    roleId?: true
    permissionId?: true
  }

  export type RolePermissionMinAggregateInputType = {
    id?: true
    roleId?: true
    permissionId?: true
  }

  export type RolePermissionMaxAggregateInputType = {
    id?: true
    roleId?: true
    permissionId?: true
  }

  export type RolePermissionCountAggregateInputType = {
    id?: true
    roleId?: true
    permissionId?: true
    _all?: true
  }

  export type RolePermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RolePermission to aggregate.
     */
    where?: RolePermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePermissions to fetch.
     */
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: RolePermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned RolePermissions
    **/
    _count?: true | RolePermissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: RolePermissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: RolePermissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: RolePermissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: RolePermissionMaxAggregateInputType
  }

  export type GetRolePermissionAggregateType<T extends RolePermissionAggregateArgs> = {
        [P in keyof T & keyof AggregateRolePermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateRolePermission[P]>
      : GetScalarType<T[P], AggregateRolePermission[P]>
  }




  export type RolePermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: RolePermissionWhereInput
    orderBy?: RolePermissionOrderByWithAggregationInput | RolePermissionOrderByWithAggregationInput[]
    by: RolePermissionScalarFieldEnum[] | RolePermissionScalarFieldEnum
    having?: RolePermissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: RolePermissionCountAggregateInputType | true
    _avg?: RolePermissionAvgAggregateInputType
    _sum?: RolePermissionSumAggregateInputType
    _min?: RolePermissionMinAggregateInputType
    _max?: RolePermissionMaxAggregateInputType
  }

  export type RolePermissionGroupByOutputType = {
    id: number
    roleId: number
    permissionId: number
    _count: RolePermissionCountAggregateOutputType | null
    _avg: RolePermissionAvgAggregateOutputType | null
    _sum: RolePermissionSumAggregateOutputType | null
    _min: RolePermissionMinAggregateOutputType | null
    _max: RolePermissionMaxAggregateOutputType | null
  }

  type GetRolePermissionGroupByPayload<T extends RolePermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<RolePermissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof RolePermissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], RolePermissionGroupByOutputType[P]>
            : GetScalarType<T[P], RolePermissionGroupByOutputType[P]>
        }
      >
    >


  export type RolePermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roleId?: boolean
    permissionId?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rolePermission"]>

  export type RolePermissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roleId?: boolean
    permissionId?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rolePermission"]>

  export type RolePermissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    roleId?: boolean
    permissionId?: boolean
    role?: boolean | RoleDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["rolePermission"]>

  export type RolePermissionSelectScalar = {
    id?: boolean
    roleId?: boolean
    permissionId?: boolean
  }

  export type RolePermissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "roleId" | "permissionId", ExtArgs["result"]["rolePermission"]>
  export type RolePermissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }
  export type RolePermissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }
  export type RolePermissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    role?: boolean | RoleDefaultArgs<ExtArgs>
    permission?: boolean | PermissionDefaultArgs<ExtArgs>
  }

  export type $RolePermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "RolePermission"
    objects: {
      role: Prisma.$RolePayload<ExtArgs>
      permission: Prisma.$PermissionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      roleId: number
      permissionId: number
    }, ExtArgs["result"]["rolePermission"]>
    composites: {}
  }

  type RolePermissionGetPayload<S extends boolean | null | undefined | RolePermissionDefaultArgs> = $Result.GetResult<Prisma.$RolePermissionPayload, S>

  type RolePermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<RolePermissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: RolePermissionCountAggregateInputType | true
    }

  export interface RolePermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['RolePermission'], meta: { name: 'RolePermission' } }
    /**
     * Find zero or one RolePermission that matches the filter.
     * @param {RolePermissionFindUniqueArgs} args - Arguments to find a RolePermission
     * @example
     * // Get one RolePermission
     * const rolePermission = await prisma.rolePermission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RolePermissionFindUniqueArgs>(args: SelectSubset<T, RolePermissionFindUniqueArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one RolePermission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RolePermissionFindUniqueOrThrowArgs} args - Arguments to find a RolePermission
     * @example
     * // Get one RolePermission
     * const rolePermission = await prisma.rolePermission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RolePermissionFindUniqueOrThrowArgs>(args: SelectSubset<T, RolePermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RolePermission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionFindFirstArgs} args - Arguments to find a RolePermission
     * @example
     * // Get one RolePermission
     * const rolePermission = await prisma.rolePermission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RolePermissionFindFirstArgs>(args?: SelectSubset<T, RolePermissionFindFirstArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first RolePermission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionFindFirstOrThrowArgs} args - Arguments to find a RolePermission
     * @example
     * // Get one RolePermission
     * const rolePermission = await prisma.rolePermission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RolePermissionFindFirstOrThrowArgs>(args?: SelectSubset<T, RolePermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more RolePermissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all RolePermissions
     * const rolePermissions = await prisma.rolePermission.findMany()
     * 
     * // Get first 10 RolePermissions
     * const rolePermissions = await prisma.rolePermission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const rolePermissionWithIdOnly = await prisma.rolePermission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends RolePermissionFindManyArgs>(args?: SelectSubset<T, RolePermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a RolePermission.
     * @param {RolePermissionCreateArgs} args - Arguments to create a RolePermission.
     * @example
     * // Create one RolePermission
     * const RolePermission = await prisma.rolePermission.create({
     *   data: {
     *     // ... data to create a RolePermission
     *   }
     * })
     * 
     */
    create<T extends RolePermissionCreateArgs>(args: SelectSubset<T, RolePermissionCreateArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many RolePermissions.
     * @param {RolePermissionCreateManyArgs} args - Arguments to create many RolePermissions.
     * @example
     * // Create many RolePermissions
     * const rolePermission = await prisma.rolePermission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends RolePermissionCreateManyArgs>(args?: SelectSubset<T, RolePermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many RolePermissions and returns the data saved in the database.
     * @param {RolePermissionCreateManyAndReturnArgs} args - Arguments to create many RolePermissions.
     * @example
     * // Create many RolePermissions
     * const rolePermission = await prisma.rolePermission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many RolePermissions and only return the `id`
     * const rolePermissionWithIdOnly = await prisma.rolePermission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends RolePermissionCreateManyAndReturnArgs>(args?: SelectSubset<T, RolePermissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a RolePermission.
     * @param {RolePermissionDeleteArgs} args - Arguments to delete one RolePermission.
     * @example
     * // Delete one RolePermission
     * const RolePermission = await prisma.rolePermission.delete({
     *   where: {
     *     // ... filter to delete one RolePermission
     *   }
     * })
     * 
     */
    delete<T extends RolePermissionDeleteArgs>(args: SelectSubset<T, RolePermissionDeleteArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one RolePermission.
     * @param {RolePermissionUpdateArgs} args - Arguments to update one RolePermission.
     * @example
     * // Update one RolePermission
     * const rolePermission = await prisma.rolePermission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends RolePermissionUpdateArgs>(args: SelectSubset<T, RolePermissionUpdateArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more RolePermissions.
     * @param {RolePermissionDeleteManyArgs} args - Arguments to filter RolePermissions to delete.
     * @example
     * // Delete a few RolePermissions
     * const { count } = await prisma.rolePermission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends RolePermissionDeleteManyArgs>(args?: SelectSubset<T, RolePermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RolePermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many RolePermissions
     * const rolePermission = await prisma.rolePermission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends RolePermissionUpdateManyArgs>(args: SelectSubset<T, RolePermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more RolePermissions and returns the data updated in the database.
     * @param {RolePermissionUpdateManyAndReturnArgs} args - Arguments to update many RolePermissions.
     * @example
     * // Update many RolePermissions
     * const rolePermission = await prisma.rolePermission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more RolePermissions and only return the `id`
     * const rolePermissionWithIdOnly = await prisma.rolePermission.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends RolePermissionUpdateManyAndReturnArgs>(args: SelectSubset<T, RolePermissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one RolePermission.
     * @param {RolePermissionUpsertArgs} args - Arguments to update or create a RolePermission.
     * @example
     * // Update or create a RolePermission
     * const rolePermission = await prisma.rolePermission.upsert({
     *   create: {
     *     // ... data to create a RolePermission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the RolePermission we want to update
     *   }
     * })
     */
    upsert<T extends RolePermissionUpsertArgs>(args: SelectSubset<T, RolePermissionUpsertArgs<ExtArgs>>): Prisma__RolePermissionClient<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of RolePermissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionCountArgs} args - Arguments to filter RolePermissions to count.
     * @example
     * // Count the number of RolePermissions
     * const count = await prisma.rolePermission.count({
     *   where: {
     *     // ... the filter for the RolePermissions we want to count
     *   }
     * })
    **/
    count<T extends RolePermissionCountArgs>(
      args?: Subset<T, RolePermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], RolePermissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a RolePermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends RolePermissionAggregateArgs>(args: Subset<T, RolePermissionAggregateArgs>): Prisma.PrismaPromise<GetRolePermissionAggregateType<T>>

    /**
     * Group by RolePermission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RolePermissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends RolePermissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: RolePermissionGroupByArgs['orderBy'] }
        : { orderBy?: RolePermissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, RolePermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRolePermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the RolePermission model
   */
  readonly fields: RolePermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for RolePermission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__RolePermissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    role<T extends RoleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, RoleDefaultArgs<ExtArgs>>): Prisma__RoleClient<$Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    permission<T extends PermissionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PermissionDefaultArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the RolePermission model
   */
  interface RolePermissionFieldRefs {
    readonly id: FieldRef<"RolePermission", 'Int'>
    readonly roleId: FieldRef<"RolePermission", 'Int'>
    readonly permissionId: FieldRef<"RolePermission", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * RolePermission findUnique
   */
  export type RolePermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermission to fetch.
     */
    where: RolePermissionWhereUniqueInput
  }

  /**
   * RolePermission findUniqueOrThrow
   */
  export type RolePermissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermission to fetch.
     */
    where: RolePermissionWhereUniqueInput
  }

  /**
   * RolePermission findFirst
   */
  export type RolePermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermission to fetch.
     */
    where?: RolePermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePermissions to fetch.
     */
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RolePermissions.
     */
    cursor?: RolePermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RolePermissions.
     */
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * RolePermission findFirstOrThrow
   */
  export type RolePermissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermission to fetch.
     */
    where?: RolePermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePermissions to fetch.
     */
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for RolePermissions.
     */
    cursor?: RolePermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePermissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of RolePermissions.
     */
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * RolePermission findMany
   */
  export type RolePermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter, which RolePermissions to fetch.
     */
    where?: RolePermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of RolePermissions to fetch.
     */
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing RolePermissions.
     */
    cursor?: RolePermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` RolePermissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` RolePermissions.
     */
    skip?: number
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * RolePermission create
   */
  export type RolePermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * The data needed to create a RolePermission.
     */
    data: XOR<RolePermissionCreateInput, RolePermissionUncheckedCreateInput>
  }

  /**
   * RolePermission createMany
   */
  export type RolePermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many RolePermissions.
     */
    data: RolePermissionCreateManyInput | RolePermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * RolePermission createManyAndReturn
   */
  export type RolePermissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * The data used to create many RolePermissions.
     */
    data: RolePermissionCreateManyInput | RolePermissionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * RolePermission update
   */
  export type RolePermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * The data needed to update a RolePermission.
     */
    data: XOR<RolePermissionUpdateInput, RolePermissionUncheckedUpdateInput>
    /**
     * Choose, which RolePermission to update.
     */
    where: RolePermissionWhereUniqueInput
  }

  /**
   * RolePermission updateMany
   */
  export type RolePermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update RolePermissions.
     */
    data: XOR<RolePermissionUpdateManyMutationInput, RolePermissionUncheckedUpdateManyInput>
    /**
     * Filter which RolePermissions to update
     */
    where?: RolePermissionWhereInput
    /**
     * Limit how many RolePermissions to update.
     */
    limit?: number
  }

  /**
   * RolePermission updateManyAndReturn
   */
  export type RolePermissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * The data used to update RolePermissions.
     */
    data: XOR<RolePermissionUpdateManyMutationInput, RolePermissionUncheckedUpdateManyInput>
    /**
     * Filter which RolePermissions to update
     */
    where?: RolePermissionWhereInput
    /**
     * Limit how many RolePermissions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * RolePermission upsert
   */
  export type RolePermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * The filter to search for the RolePermission to update in case it exists.
     */
    where: RolePermissionWhereUniqueInput
    /**
     * In case the RolePermission found by the `where` argument doesn't exist, create a new RolePermission with this data.
     */
    create: XOR<RolePermissionCreateInput, RolePermissionUncheckedCreateInput>
    /**
     * In case the RolePermission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<RolePermissionUpdateInput, RolePermissionUncheckedUpdateInput>
  }

  /**
   * RolePermission delete
   */
  export type RolePermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    /**
     * Filter which RolePermission to delete.
     */
    where: RolePermissionWhereUniqueInput
  }

  /**
   * RolePermission deleteMany
   */
  export type RolePermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which RolePermissions to delete
     */
    where?: RolePermissionWhereInput
    /**
     * Limit how many RolePermissions to delete.
     */
    limit?: number
  }

  /**
   * RolePermission without action
   */
  export type RolePermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
  }


  /**
   * Model Permission
   */

  export type AggregatePermission = {
    _count: PermissionCountAggregateOutputType | null
    _avg: PermissionAvgAggregateOutputType | null
    _sum: PermissionSumAggregateOutputType | null
    _min: PermissionMinAggregateOutputType | null
    _max: PermissionMaxAggregateOutputType | null
  }

  export type PermissionAvgAggregateOutputType = {
    id: number | null
  }

  export type PermissionSumAggregateOutputType = {
    id: number | null
  }

  export type PermissionMinAggregateOutputType = {
    id: number | null
    name: string | null
    displayName: string | null
    category: string | null
    description: string | null
  }

  export type PermissionMaxAggregateOutputType = {
    id: number | null
    name: string | null
    displayName: string | null
    category: string | null
    description: string | null
  }

  export type PermissionCountAggregateOutputType = {
    id: number
    name: number
    displayName: number
    category: number
    description: number
    _all: number
  }


  export type PermissionAvgAggregateInputType = {
    id?: true
  }

  export type PermissionSumAggregateInputType = {
    id?: true
  }

  export type PermissionMinAggregateInputType = {
    id?: true
    name?: true
    displayName?: true
    category?: true
    description?: true
  }

  export type PermissionMaxAggregateInputType = {
    id?: true
    name?: true
    displayName?: true
    category?: true
    description?: true
  }

  export type PermissionCountAggregateInputType = {
    id?: true
    name?: true
    displayName?: true
    category?: true
    description?: true
    _all?: true
  }

  export type PermissionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Permission to aggregate.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Permissions
    **/
    _count?: true | PermissionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PermissionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PermissionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PermissionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PermissionMaxAggregateInputType
  }

  export type GetPermissionAggregateType<T extends PermissionAggregateArgs> = {
        [P in keyof T & keyof AggregatePermission]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePermission[P]>
      : GetScalarType<T[P], AggregatePermission[P]>
  }




  export type PermissionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PermissionWhereInput
    orderBy?: PermissionOrderByWithAggregationInput | PermissionOrderByWithAggregationInput[]
    by: PermissionScalarFieldEnum[] | PermissionScalarFieldEnum
    having?: PermissionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PermissionCountAggregateInputType | true
    _avg?: PermissionAvgAggregateInputType
    _sum?: PermissionSumAggregateInputType
    _min?: PermissionMinAggregateInputType
    _max?: PermissionMaxAggregateInputType
  }

  export type PermissionGroupByOutputType = {
    id: number
    name: string
    displayName: string
    category: string
    description: string | null
    _count: PermissionCountAggregateOutputType | null
    _avg: PermissionAvgAggregateOutputType | null
    _sum: PermissionSumAggregateOutputType | null
    _min: PermissionMinAggregateOutputType | null
    _max: PermissionMaxAggregateOutputType | null
  }

  type GetPermissionGroupByPayload<T extends PermissionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PermissionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PermissionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PermissionGroupByOutputType[P]>
            : GetScalarType<T[P], PermissionGroupByOutputType[P]>
        }
      >
    >


  export type PermissionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    displayName?: boolean
    category?: boolean
    description?: boolean
    roles?: boolean | Permission$rolesArgs<ExtArgs>
    _count?: boolean | PermissionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    displayName?: boolean
    category?: boolean
    description?: boolean
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    displayName?: boolean
    category?: boolean
    description?: boolean
  }, ExtArgs["result"]["permission"]>

  export type PermissionSelectScalar = {
    id?: boolean
    name?: boolean
    displayName?: boolean
    category?: boolean
    description?: boolean
  }

  export type PermissionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "displayName" | "category" | "description", ExtArgs["result"]["permission"]>
  export type PermissionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    roles?: boolean | Permission$rolesArgs<ExtArgs>
    _count?: boolean | PermissionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PermissionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PermissionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PermissionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Permission"
    objects: {
      roles: Prisma.$RolePermissionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      displayName: string
      category: string
      description: string | null
    }, ExtArgs["result"]["permission"]>
    composites: {}
  }

  type PermissionGetPayload<S extends boolean | null | undefined | PermissionDefaultArgs> = $Result.GetResult<Prisma.$PermissionPayload, S>

  type PermissionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PermissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PermissionCountAggregateInputType | true
    }

  export interface PermissionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Permission'], meta: { name: 'Permission' } }
    /**
     * Find zero or one Permission that matches the filter.
     * @param {PermissionFindUniqueArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PermissionFindUniqueArgs>(args: SelectSubset<T, PermissionFindUniqueArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Permission that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PermissionFindUniqueOrThrowArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PermissionFindUniqueOrThrowArgs>(args: SelectSubset<T, PermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Permission that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindFirstArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PermissionFindFirstArgs>(args?: SelectSubset<T, PermissionFindFirstArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Permission that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindFirstOrThrowArgs} args - Arguments to find a Permission
     * @example
     * // Get one Permission
     * const permission = await prisma.permission.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PermissionFindFirstOrThrowArgs>(args?: SelectSubset<T, PermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Permissions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Permissions
     * const permissions = await prisma.permission.findMany()
     * 
     * // Get first 10 Permissions
     * const permissions = await prisma.permission.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const permissionWithIdOnly = await prisma.permission.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PermissionFindManyArgs>(args?: SelectSubset<T, PermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Permission.
     * @param {PermissionCreateArgs} args - Arguments to create a Permission.
     * @example
     * // Create one Permission
     * const Permission = await prisma.permission.create({
     *   data: {
     *     // ... data to create a Permission
     *   }
     * })
     * 
     */
    create<T extends PermissionCreateArgs>(args: SelectSubset<T, PermissionCreateArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Permissions.
     * @param {PermissionCreateManyArgs} args - Arguments to create many Permissions.
     * @example
     * // Create many Permissions
     * const permission = await prisma.permission.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PermissionCreateManyArgs>(args?: SelectSubset<T, PermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Permissions and returns the data saved in the database.
     * @param {PermissionCreateManyAndReturnArgs} args - Arguments to create many Permissions.
     * @example
     * // Create many Permissions
     * const permission = await prisma.permission.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Permissions and only return the `id`
     * const permissionWithIdOnly = await prisma.permission.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PermissionCreateManyAndReturnArgs>(args?: SelectSubset<T, PermissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Permission.
     * @param {PermissionDeleteArgs} args - Arguments to delete one Permission.
     * @example
     * // Delete one Permission
     * const Permission = await prisma.permission.delete({
     *   where: {
     *     // ... filter to delete one Permission
     *   }
     * })
     * 
     */
    delete<T extends PermissionDeleteArgs>(args: SelectSubset<T, PermissionDeleteArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Permission.
     * @param {PermissionUpdateArgs} args - Arguments to update one Permission.
     * @example
     * // Update one Permission
     * const permission = await prisma.permission.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PermissionUpdateArgs>(args: SelectSubset<T, PermissionUpdateArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Permissions.
     * @param {PermissionDeleteManyArgs} args - Arguments to filter Permissions to delete.
     * @example
     * // Delete a few Permissions
     * const { count } = await prisma.permission.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PermissionDeleteManyArgs>(args?: SelectSubset<T, PermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Permissions
     * const permission = await prisma.permission.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PermissionUpdateManyArgs>(args: SelectSubset<T, PermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Permissions and returns the data updated in the database.
     * @param {PermissionUpdateManyAndReturnArgs} args - Arguments to update many Permissions.
     * @example
     * // Update many Permissions
     * const permission = await prisma.permission.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Permissions and only return the `id`
     * const permissionWithIdOnly = await prisma.permission.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PermissionUpdateManyAndReturnArgs>(args: SelectSubset<T, PermissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Permission.
     * @param {PermissionUpsertArgs} args - Arguments to update or create a Permission.
     * @example
     * // Update or create a Permission
     * const permission = await prisma.permission.upsert({
     *   create: {
     *     // ... data to create a Permission
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Permission we want to update
     *   }
     * })
     */
    upsert<T extends PermissionUpsertArgs>(args: SelectSubset<T, PermissionUpsertArgs<ExtArgs>>): Prisma__PermissionClient<$Result.GetResult<Prisma.$PermissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Permissions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionCountArgs} args - Arguments to filter Permissions to count.
     * @example
     * // Count the number of Permissions
     * const count = await prisma.permission.count({
     *   where: {
     *     // ... the filter for the Permissions we want to count
     *   }
     * })
    **/
    count<T extends PermissionCountArgs>(
      args?: Subset<T, PermissionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PermissionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Permission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PermissionAggregateArgs>(args: Subset<T, PermissionAggregateArgs>): Prisma.PrismaPromise<GetPermissionAggregateType<T>>

    /**
     * Group by Permission.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PermissionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PermissionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PermissionGroupByArgs['orderBy'] }
        : { orderBy?: PermissionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Permission model
   */
  readonly fields: PermissionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Permission.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PermissionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    roles<T extends Permission$rolesArgs<ExtArgs> = {}>(args?: Subset<T, Permission$rolesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Permission model
   */
  interface PermissionFieldRefs {
    readonly id: FieldRef<"Permission", 'Int'>
    readonly name: FieldRef<"Permission", 'String'>
    readonly displayName: FieldRef<"Permission", 'String'>
    readonly category: FieldRef<"Permission", 'String'>
    readonly description: FieldRef<"Permission", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Permission findUnique
   */
  export type PermissionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission findUniqueOrThrow
   */
  export type PermissionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission findFirst
   */
  export type PermissionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Permission findFirstOrThrow
   */
  export type PermissionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permission to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Permissions.
     */
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Permission findMany
   */
  export type PermissionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter, which Permissions to fetch.
     */
    where?: PermissionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Permissions to fetch.
     */
    orderBy?: PermissionOrderByWithRelationInput | PermissionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Permissions.
     */
    cursor?: PermissionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Permissions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Permissions.
     */
    skip?: number
    distinct?: PermissionScalarFieldEnum | PermissionScalarFieldEnum[]
  }

  /**
   * Permission create
   */
  export type PermissionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The data needed to create a Permission.
     */
    data: XOR<PermissionCreateInput, PermissionUncheckedCreateInput>
  }

  /**
   * Permission createMany
   */
  export type PermissionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Permissions.
     */
    data: PermissionCreateManyInput | PermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Permission createManyAndReturn
   */
  export type PermissionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * The data used to create many Permissions.
     */
    data: PermissionCreateManyInput | PermissionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Permission update
   */
  export type PermissionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The data needed to update a Permission.
     */
    data: XOR<PermissionUpdateInput, PermissionUncheckedUpdateInput>
    /**
     * Choose, which Permission to update.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission updateMany
   */
  export type PermissionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Permissions.
     */
    data: XOR<PermissionUpdateManyMutationInput, PermissionUncheckedUpdateManyInput>
    /**
     * Filter which Permissions to update
     */
    where?: PermissionWhereInput
    /**
     * Limit how many Permissions to update.
     */
    limit?: number
  }

  /**
   * Permission updateManyAndReturn
   */
  export type PermissionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * The data used to update Permissions.
     */
    data: XOR<PermissionUpdateManyMutationInput, PermissionUncheckedUpdateManyInput>
    /**
     * Filter which Permissions to update
     */
    where?: PermissionWhereInput
    /**
     * Limit how many Permissions to update.
     */
    limit?: number
  }

  /**
   * Permission upsert
   */
  export type PermissionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * The filter to search for the Permission to update in case it exists.
     */
    where: PermissionWhereUniqueInput
    /**
     * In case the Permission found by the `where` argument doesn't exist, create a new Permission with this data.
     */
    create: XOR<PermissionCreateInput, PermissionUncheckedCreateInput>
    /**
     * In case the Permission was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PermissionUpdateInput, PermissionUncheckedUpdateInput>
  }

  /**
   * Permission delete
   */
  export type PermissionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
    /**
     * Filter which Permission to delete.
     */
    where: PermissionWhereUniqueInput
  }

  /**
   * Permission deleteMany
   */
  export type PermissionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Permissions to delete
     */
    where?: PermissionWhereInput
    /**
     * Limit how many Permissions to delete.
     */
    limit?: number
  }

  /**
   * Permission.roles
   */
  export type Permission$rolesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RolePermission
     */
    select?: RolePermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the RolePermission
     */
    omit?: RolePermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: RolePermissionInclude<ExtArgs> | null
    where?: RolePermissionWhereInput
    orderBy?: RolePermissionOrderByWithRelationInput | RolePermissionOrderByWithRelationInput[]
    cursor?: RolePermissionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: RolePermissionScalarFieldEnum | RolePermissionScalarFieldEnum[]
  }

  /**
   * Permission without action
   */
  export type PermissionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Permission
     */
    select?: PermissionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Permission
     */
    omit?: PermissionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PermissionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    title: 'title',
    imageUrl: 'imageUrl',
    firstName: 'firstName',
    lastName: 'lastName',
    gender: 'gender',
    email: 'email',
    mobile: 'mobile',
    passwordHash: 'passwordHash',
    isActive: 'isActive',
    hashedRefreshToken: 'hashedRefreshToken',
    dateOfBirth: 'dateOfBirth',
    roleId: 'roleId',
    organizationId: 'organizationId',
    deletedAt: 'deletedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const OrganizationScalarFieldEnum: {
    id: 'id',
    OrganizationName: 'OrganizationName',
    Organizationcode: 'Organizationcode',
    logoUrl: 'logoUrl',
    email: 'email',
    contactNumber: 'contactNumber',
    Orgnizationtype: 'Orgnizationtype',
    website: 'website',
    addressLine1: 'addressLine1',
    addressLine2: 'addressLine2',
    city: 'city',
    state: 'state',
    country: 'country',
    postalCode: 'postalCode',
    registrationNo: 'registrationNo',
    establishedOn: 'establishedOn',
    industryType: 'industryType',
    status: 'status',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OrganizationScalarFieldEnum = (typeof OrganizationScalarFieldEnum)[keyof typeof OrganizationScalarFieldEnum]


  export const HospitalScalarFieldEnum: {
    id: 'id',
    name: 'name',
    hospitalCode: 'hospitalCode',
    ParentHospitalCode: 'ParentHospitalCode',
    Organizationcode: 'Organizationcode',
    SpecializationType: 'SpecializationType',
    address: 'address',
    city: 'city',
    state: 'state',
    country: 'country',
    postalCode: 'postalCode',
    contactNumber: 'contactNumber',
    email: 'email',
    website: 'website',
    logoUrl: 'logoUrl',
    latitude: 'latitude',
    longitude: 'longitude',
    status: 'status',
    level: 'level',
    parentHospitalId: 'parentHospitalId',
    organizationId: 'organizationId',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    deletedAt: 'deletedAt'
  };

  export type HospitalScalarFieldEnum = (typeof HospitalScalarFieldEnum)[keyof typeof HospitalScalarFieldEnum]


  export const UserHospitalAccessScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    hospitalId: 'hospitalId',
    roleId: 'roleId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserHospitalAccessScalarFieldEnum = (typeof UserHospitalAccessScalarFieldEnum)[keyof typeof UserHospitalAccessScalarFieldEnum]


  export const SettingScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    theme: 'theme',
    language: 'language'
  };

  export type SettingScalarFieldEnum = (typeof SettingScalarFieldEnum)[keyof typeof SettingScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    action: 'action',
    entity: 'entity',
    entityId: 'entityId',
    timestamp: 'timestamp',
    metadata: 'metadata'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const LoginSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent',
    loginAt: 'loginAt'
  };

  export type LoginSessionScalarFieldEnum = (typeof LoginSessionScalarFieldEnum)[keyof typeof LoginSessionScalarFieldEnum]


  export const RoleScalarFieldEnum: {
    id: 'id',
    Rolename: 'Rolename',
    description: 'description',
    isActive: 'isActive'
  };

  export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum]


  export const RolePermissionScalarFieldEnum: {
    id: 'id',
    roleId: 'roleId',
    permissionId: 'permissionId'
  };

  export type RolePermissionScalarFieldEnum = (typeof RolePermissionScalarFieldEnum)[keyof typeof RolePermissionScalarFieldEnum]


  export const PermissionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    displayName: 'displayName',
    category: 'category',
    description: 'description'
  };

  export type PermissionScalarFieldEnum = (typeof PermissionScalarFieldEnum)[keyof typeof PermissionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Title'
   */
  export type EnumTitleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Title'>
    


  /**
   * Reference to a field of type 'Title[]'
   */
  export type ListEnumTitleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Title[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'OrganizationType'
   */
  export type EnumOrganizationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrganizationType'>
    


  /**
   * Reference to a field of type 'OrganizationType[]'
   */
  export type ListEnumOrganizationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'OrganizationType[]'>
    


  /**
   * Reference to a field of type 'Hospital_Org_status'
   */
  export type EnumHospital_Org_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Hospital_Org_status'>
    


  /**
   * Reference to a field of type 'Hospital_Org_status[]'
   */
  export type ListEnumHospital_Org_statusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Hospital_Org_status[]'>
    


  /**
   * Reference to a field of type 'SpecializationType'
   */
  export type EnumSpecializationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SpecializationType'>
    


  /**
   * Reference to a field of type 'SpecializationType[]'
   */
  export type ListEnumSpecializationTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SpecializationType[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'HospitalLevel'
   */
  export type EnumHospitalLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HospitalLevel'>
    


  /**
   * Reference to a field of type 'HospitalLevel[]'
   */
  export type ListEnumHospitalLevelFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HospitalLevel[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    title?: EnumTitleFilter<"User"> | $Enums.Title
    imageUrl?: StringFilter<"User"> | string
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    gender?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    mobile?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    isActive?: BoolFilter<"User"> | boolean
    hashedRefreshToken?: StringFilter<"User"> | string
    dateOfBirth?: DateTimeFilter<"User"> | Date | string
    roleId?: IntFilter<"User"> | number
    organizationId?: IntFilter<"User"> | number
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    settings?: XOR<SettingNullableScalarRelationFilter, SettingWhereInput> | null
    auditLogs?: AuditLogListRelationFilter
    loginSessions?: LoginSessionListRelationFilter
    AdminAccess?: UserHospitalAccessListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    imageUrl?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    gender?: SortOrder
    email?: SortOrder
    mobile?: SortOrder
    passwordHash?: SortOrder
    isActive?: SortOrder
    hashedRefreshToken?: SortOrder
    dateOfBirth?: SortOrder
    roleId?: SortOrder
    organizationId?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    role?: RoleOrderByWithRelationInput
    organization?: OrganizationOrderByWithRelationInput
    settings?: SettingOrderByWithRelationInput
    auditLogs?: AuditLogOrderByRelationAggregateInput
    loginSessions?: LoginSessionOrderByRelationAggregateInput
    AdminAccess?: UserHospitalAccessOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    mobile?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    title?: EnumTitleFilter<"User"> | $Enums.Title
    imageUrl?: StringFilter<"User"> | string
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    gender?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    isActive?: BoolFilter<"User"> | boolean
    hashedRefreshToken?: StringFilter<"User"> | string
    dateOfBirth?: DateTimeFilter<"User"> | Date | string
    roleId?: IntFilter<"User"> | number
    organizationId?: IntFilter<"User"> | number
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    settings?: XOR<SettingNullableScalarRelationFilter, SettingWhereInput> | null
    auditLogs?: AuditLogListRelationFilter
    loginSessions?: LoginSessionListRelationFilter
    AdminAccess?: UserHospitalAccessListRelationFilter
  }, "id" | "email" | "mobile">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    imageUrl?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    gender?: SortOrder
    email?: SortOrder
    mobile?: SortOrder
    passwordHash?: SortOrder
    isActive?: SortOrder
    hashedRefreshToken?: SortOrder
    dateOfBirth?: SortOrder
    roleId?: SortOrder
    organizationId?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    title?: EnumTitleWithAggregatesFilter<"User"> | $Enums.Title
    imageUrl?: StringWithAggregatesFilter<"User"> | string
    firstName?: StringWithAggregatesFilter<"User"> | string
    lastName?: StringWithAggregatesFilter<"User"> | string
    gender?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    mobile?: StringWithAggregatesFilter<"User"> | string
    passwordHash?: StringWithAggregatesFilter<"User"> | string
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    hashedRefreshToken?: StringWithAggregatesFilter<"User"> | string
    dateOfBirth?: DateTimeWithAggregatesFilter<"User"> | Date | string
    roleId?: IntWithAggregatesFilter<"User"> | number
    organizationId?: IntWithAggregatesFilter<"User"> | number
    deletedAt?: DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null
  }

  export type OrganizationWhereInput = {
    AND?: OrganizationWhereInput | OrganizationWhereInput[]
    OR?: OrganizationWhereInput[]
    NOT?: OrganizationWhereInput | OrganizationWhereInput[]
    id?: IntFilter<"Organization"> | number
    OrganizationName?: StringFilter<"Organization"> | string
    Organizationcode?: StringFilter<"Organization"> | string
    logoUrl?: StringFilter<"Organization"> | string
    email?: StringFilter<"Organization"> | string
    contactNumber?: StringFilter<"Organization"> | string
    Orgnizationtype?: EnumOrganizationTypeNullableFilter<"Organization"> | $Enums.OrganizationType | null
    website?: StringFilter<"Organization"> | string
    addressLine1?: StringFilter<"Organization"> | string
    addressLine2?: StringFilter<"Organization"> | string
    city?: StringFilter<"Organization"> | string
    state?: StringFilter<"Organization"> | string
    country?: StringFilter<"Organization"> | string
    postalCode?: StringFilter<"Organization"> | string
    registrationNo?: StringFilter<"Organization"> | string
    establishedOn?: DateTimeFilter<"Organization"> | Date | string
    industryType?: StringFilter<"Organization"> | string
    status?: EnumHospital_Org_statusFilter<"Organization"> | $Enums.Hospital_Org_status
    description?: StringNullableFilter<"Organization"> | string | null
    createdAt?: DateTimeFilter<"Organization"> | Date | string
    updatedAt?: DateTimeFilter<"Organization"> | Date | string
    hospitals?: HospitalListRelationFilter
    users?: UserListRelationFilter
  }

  export type OrganizationOrderByWithRelationInput = {
    id?: SortOrder
    OrganizationName?: SortOrder
    Organizationcode?: SortOrder
    logoUrl?: SortOrder
    email?: SortOrder
    contactNumber?: SortOrder
    Orgnizationtype?: SortOrderInput | SortOrder
    website?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    postalCode?: SortOrder
    registrationNo?: SortOrder
    establishedOn?: SortOrder
    industryType?: SortOrder
    status?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    hospitals?: HospitalOrderByRelationAggregateInput
    users?: UserOrderByRelationAggregateInput
  }

  export type OrganizationWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    Organizationcode?: string
    email?: string
    AND?: OrganizationWhereInput | OrganizationWhereInput[]
    OR?: OrganizationWhereInput[]
    NOT?: OrganizationWhereInput | OrganizationWhereInput[]
    OrganizationName?: StringFilter<"Organization"> | string
    logoUrl?: StringFilter<"Organization"> | string
    contactNumber?: StringFilter<"Organization"> | string
    Orgnizationtype?: EnumOrganizationTypeNullableFilter<"Organization"> | $Enums.OrganizationType | null
    website?: StringFilter<"Organization"> | string
    addressLine1?: StringFilter<"Organization"> | string
    addressLine2?: StringFilter<"Organization"> | string
    city?: StringFilter<"Organization"> | string
    state?: StringFilter<"Organization"> | string
    country?: StringFilter<"Organization"> | string
    postalCode?: StringFilter<"Organization"> | string
    registrationNo?: StringFilter<"Organization"> | string
    establishedOn?: DateTimeFilter<"Organization"> | Date | string
    industryType?: StringFilter<"Organization"> | string
    status?: EnumHospital_Org_statusFilter<"Organization"> | $Enums.Hospital_Org_status
    description?: StringNullableFilter<"Organization"> | string | null
    createdAt?: DateTimeFilter<"Organization"> | Date | string
    updatedAt?: DateTimeFilter<"Organization"> | Date | string
    hospitals?: HospitalListRelationFilter
    users?: UserListRelationFilter
  }, "id" | "Organizationcode" | "email">

  export type OrganizationOrderByWithAggregationInput = {
    id?: SortOrder
    OrganizationName?: SortOrder
    Organizationcode?: SortOrder
    logoUrl?: SortOrder
    email?: SortOrder
    contactNumber?: SortOrder
    Orgnizationtype?: SortOrderInput | SortOrder
    website?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    postalCode?: SortOrder
    registrationNo?: SortOrder
    establishedOn?: SortOrder
    industryType?: SortOrder
    status?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OrganizationCountOrderByAggregateInput
    _avg?: OrganizationAvgOrderByAggregateInput
    _max?: OrganizationMaxOrderByAggregateInput
    _min?: OrganizationMinOrderByAggregateInput
    _sum?: OrganizationSumOrderByAggregateInput
  }

  export type OrganizationScalarWhereWithAggregatesInput = {
    AND?: OrganizationScalarWhereWithAggregatesInput | OrganizationScalarWhereWithAggregatesInput[]
    OR?: OrganizationScalarWhereWithAggregatesInput[]
    NOT?: OrganizationScalarWhereWithAggregatesInput | OrganizationScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Organization"> | number
    OrganizationName?: StringWithAggregatesFilter<"Organization"> | string
    Organizationcode?: StringWithAggregatesFilter<"Organization"> | string
    logoUrl?: StringWithAggregatesFilter<"Organization"> | string
    email?: StringWithAggregatesFilter<"Organization"> | string
    contactNumber?: StringWithAggregatesFilter<"Organization"> | string
    Orgnizationtype?: EnumOrganizationTypeNullableWithAggregatesFilter<"Organization"> | $Enums.OrganizationType | null
    website?: StringWithAggregatesFilter<"Organization"> | string
    addressLine1?: StringWithAggregatesFilter<"Organization"> | string
    addressLine2?: StringWithAggregatesFilter<"Organization"> | string
    city?: StringWithAggregatesFilter<"Organization"> | string
    state?: StringWithAggregatesFilter<"Organization"> | string
    country?: StringWithAggregatesFilter<"Organization"> | string
    postalCode?: StringWithAggregatesFilter<"Organization"> | string
    registrationNo?: StringWithAggregatesFilter<"Organization"> | string
    establishedOn?: DateTimeWithAggregatesFilter<"Organization"> | Date | string
    industryType?: StringWithAggregatesFilter<"Organization"> | string
    status?: EnumHospital_Org_statusWithAggregatesFilter<"Organization"> | $Enums.Hospital_Org_status
    description?: StringNullableWithAggregatesFilter<"Organization"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Organization"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Organization"> | Date | string
  }

  export type HospitalWhereInput = {
    AND?: HospitalWhereInput | HospitalWhereInput[]
    OR?: HospitalWhereInput[]
    NOT?: HospitalWhereInput | HospitalWhereInput[]
    id?: IntFilter<"Hospital"> | number
    name?: StringFilter<"Hospital"> | string
    hospitalCode?: StringFilter<"Hospital"> | string
    ParentHospitalCode?: StringNullableFilter<"Hospital"> | string | null
    Organizationcode?: StringNullableFilter<"Hospital"> | string | null
    SpecializationType?: EnumSpecializationTypeFilter<"Hospital"> | $Enums.SpecializationType
    address?: StringFilter<"Hospital"> | string
    city?: StringFilter<"Hospital"> | string
    state?: StringFilter<"Hospital"> | string
    country?: StringFilter<"Hospital"> | string
    postalCode?: StringFilter<"Hospital"> | string
    contactNumber?: StringFilter<"Hospital"> | string
    email?: StringFilter<"Hospital"> | string
    website?: StringFilter<"Hospital"> | string
    logoUrl?: StringFilter<"Hospital"> | string
    latitude?: FloatFilter<"Hospital"> | number
    longitude?: FloatFilter<"Hospital"> | number
    status?: EnumHospital_Org_statusFilter<"Hospital"> | $Enums.Hospital_Org_status
    level?: EnumHospitalLevelFilter<"Hospital"> | $Enums.HospitalLevel
    parentHospitalId?: IntNullableFilter<"Hospital"> | number | null
    organizationId?: IntFilter<"Hospital"> | number
    isActive?: BoolFilter<"Hospital"> | boolean
    createdAt?: DateTimeFilter<"Hospital"> | Date | string
    updatedAt?: DateTimeFilter<"Hospital"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Hospital"> | Date | string | null
    parentHospital?: XOR<HospitalNullableScalarRelationFilter, HospitalWhereInput> | null
    childHospital?: HospitalListRelationFilter
    Organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    users?: UserHospitalAccessListRelationFilter
  }

  export type HospitalOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    hospitalCode?: SortOrder
    ParentHospitalCode?: SortOrderInput | SortOrder
    Organizationcode?: SortOrderInput | SortOrder
    SpecializationType?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    postalCode?: SortOrder
    contactNumber?: SortOrder
    email?: SortOrder
    website?: SortOrder
    logoUrl?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    status?: SortOrder
    level?: SortOrder
    parentHospitalId?: SortOrderInput | SortOrder
    organizationId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    parentHospital?: HospitalOrderByWithRelationInput
    childHospital?: HospitalOrderByRelationAggregateInput
    Organization?: OrganizationOrderByWithRelationInput
    users?: UserHospitalAccessOrderByRelationAggregateInput
  }

  export type HospitalWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    hospitalCode?: string
    AND?: HospitalWhereInput | HospitalWhereInput[]
    OR?: HospitalWhereInput[]
    NOT?: HospitalWhereInput | HospitalWhereInput[]
    name?: StringFilter<"Hospital"> | string
    ParentHospitalCode?: StringNullableFilter<"Hospital"> | string | null
    Organizationcode?: StringNullableFilter<"Hospital"> | string | null
    SpecializationType?: EnumSpecializationTypeFilter<"Hospital"> | $Enums.SpecializationType
    address?: StringFilter<"Hospital"> | string
    city?: StringFilter<"Hospital"> | string
    state?: StringFilter<"Hospital"> | string
    country?: StringFilter<"Hospital"> | string
    postalCode?: StringFilter<"Hospital"> | string
    contactNumber?: StringFilter<"Hospital"> | string
    email?: StringFilter<"Hospital"> | string
    website?: StringFilter<"Hospital"> | string
    logoUrl?: StringFilter<"Hospital"> | string
    latitude?: FloatFilter<"Hospital"> | number
    longitude?: FloatFilter<"Hospital"> | number
    status?: EnumHospital_Org_statusFilter<"Hospital"> | $Enums.Hospital_Org_status
    level?: EnumHospitalLevelFilter<"Hospital"> | $Enums.HospitalLevel
    parentHospitalId?: IntNullableFilter<"Hospital"> | number | null
    organizationId?: IntFilter<"Hospital"> | number
    isActive?: BoolFilter<"Hospital"> | boolean
    createdAt?: DateTimeFilter<"Hospital"> | Date | string
    updatedAt?: DateTimeFilter<"Hospital"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Hospital"> | Date | string | null
    parentHospital?: XOR<HospitalNullableScalarRelationFilter, HospitalWhereInput> | null
    childHospital?: HospitalListRelationFilter
    Organization?: XOR<OrganizationScalarRelationFilter, OrganizationWhereInput>
    users?: UserHospitalAccessListRelationFilter
  }, "id" | "hospitalCode">

  export type HospitalOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    hospitalCode?: SortOrder
    ParentHospitalCode?: SortOrderInput | SortOrder
    Organizationcode?: SortOrderInput | SortOrder
    SpecializationType?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    postalCode?: SortOrder
    contactNumber?: SortOrder
    email?: SortOrder
    website?: SortOrder
    logoUrl?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    status?: SortOrder
    level?: SortOrder
    parentHospitalId?: SortOrderInput | SortOrder
    organizationId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    _count?: HospitalCountOrderByAggregateInput
    _avg?: HospitalAvgOrderByAggregateInput
    _max?: HospitalMaxOrderByAggregateInput
    _min?: HospitalMinOrderByAggregateInput
    _sum?: HospitalSumOrderByAggregateInput
  }

  export type HospitalScalarWhereWithAggregatesInput = {
    AND?: HospitalScalarWhereWithAggregatesInput | HospitalScalarWhereWithAggregatesInput[]
    OR?: HospitalScalarWhereWithAggregatesInput[]
    NOT?: HospitalScalarWhereWithAggregatesInput | HospitalScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Hospital"> | number
    name?: StringWithAggregatesFilter<"Hospital"> | string
    hospitalCode?: StringWithAggregatesFilter<"Hospital"> | string
    ParentHospitalCode?: StringNullableWithAggregatesFilter<"Hospital"> | string | null
    Organizationcode?: StringNullableWithAggregatesFilter<"Hospital"> | string | null
    SpecializationType?: EnumSpecializationTypeWithAggregatesFilter<"Hospital"> | $Enums.SpecializationType
    address?: StringWithAggregatesFilter<"Hospital"> | string
    city?: StringWithAggregatesFilter<"Hospital"> | string
    state?: StringWithAggregatesFilter<"Hospital"> | string
    country?: StringWithAggregatesFilter<"Hospital"> | string
    postalCode?: StringWithAggregatesFilter<"Hospital"> | string
    contactNumber?: StringWithAggregatesFilter<"Hospital"> | string
    email?: StringWithAggregatesFilter<"Hospital"> | string
    website?: StringWithAggregatesFilter<"Hospital"> | string
    logoUrl?: StringWithAggregatesFilter<"Hospital"> | string
    latitude?: FloatWithAggregatesFilter<"Hospital"> | number
    longitude?: FloatWithAggregatesFilter<"Hospital"> | number
    status?: EnumHospital_Org_statusWithAggregatesFilter<"Hospital"> | $Enums.Hospital_Org_status
    level?: EnumHospitalLevelWithAggregatesFilter<"Hospital"> | $Enums.HospitalLevel
    parentHospitalId?: IntNullableWithAggregatesFilter<"Hospital"> | number | null
    organizationId?: IntWithAggregatesFilter<"Hospital"> | number
    isActive?: BoolWithAggregatesFilter<"Hospital"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Hospital"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Hospital"> | Date | string
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Hospital"> | Date | string | null
  }

  export type UserHospitalAccessWhereInput = {
    AND?: UserHospitalAccessWhereInput | UserHospitalAccessWhereInput[]
    OR?: UserHospitalAccessWhereInput[]
    NOT?: UserHospitalAccessWhereInput | UserHospitalAccessWhereInput[]
    id?: IntFilter<"UserHospitalAccess"> | number
    userId?: IntFilter<"UserHospitalAccess"> | number
    hospitalId?: IntFilter<"UserHospitalAccess"> | number
    roleId?: IntFilter<"UserHospitalAccess"> | number
    createdAt?: DateTimeFilter<"UserHospitalAccess"> | Date | string
    updatedAt?: DateTimeFilter<"UserHospitalAccess"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    hospital?: XOR<HospitalScalarRelationFilter, HospitalWhereInput>
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
  }

  export type UserHospitalAccessOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    hospitalId?: SortOrder
    roleId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    hospital?: HospitalOrderByWithRelationInput
    role?: RoleOrderByWithRelationInput
  }

  export type UserHospitalAccessWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userId_hospitalId?: UserHospitalAccessUserIdHospitalIdCompoundUniqueInput
    AND?: UserHospitalAccessWhereInput | UserHospitalAccessWhereInput[]
    OR?: UserHospitalAccessWhereInput[]
    NOT?: UserHospitalAccessWhereInput | UserHospitalAccessWhereInput[]
    userId?: IntFilter<"UserHospitalAccess"> | number
    hospitalId?: IntFilter<"UserHospitalAccess"> | number
    roleId?: IntFilter<"UserHospitalAccess"> | number
    createdAt?: DateTimeFilter<"UserHospitalAccess"> | Date | string
    updatedAt?: DateTimeFilter<"UserHospitalAccess"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    hospital?: XOR<HospitalScalarRelationFilter, HospitalWhereInput>
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
  }, "id" | "userId_hospitalId">

  export type UserHospitalAccessOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    hospitalId?: SortOrder
    roleId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserHospitalAccessCountOrderByAggregateInput
    _avg?: UserHospitalAccessAvgOrderByAggregateInput
    _max?: UserHospitalAccessMaxOrderByAggregateInput
    _min?: UserHospitalAccessMinOrderByAggregateInput
    _sum?: UserHospitalAccessSumOrderByAggregateInput
  }

  export type UserHospitalAccessScalarWhereWithAggregatesInput = {
    AND?: UserHospitalAccessScalarWhereWithAggregatesInput | UserHospitalAccessScalarWhereWithAggregatesInput[]
    OR?: UserHospitalAccessScalarWhereWithAggregatesInput[]
    NOT?: UserHospitalAccessScalarWhereWithAggregatesInput | UserHospitalAccessScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"UserHospitalAccess"> | number
    userId?: IntWithAggregatesFilter<"UserHospitalAccess"> | number
    hospitalId?: IntWithAggregatesFilter<"UserHospitalAccess"> | number
    roleId?: IntWithAggregatesFilter<"UserHospitalAccess"> | number
    createdAt?: DateTimeWithAggregatesFilter<"UserHospitalAccess"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserHospitalAccess"> | Date | string
  }

  export type SettingWhereInput = {
    AND?: SettingWhereInput | SettingWhereInput[]
    OR?: SettingWhereInput[]
    NOT?: SettingWhereInput | SettingWhereInput[]
    id?: IntFilter<"Setting"> | number
    userId?: IntFilter<"Setting"> | number
    theme?: StringFilter<"Setting"> | string
    language?: StringFilter<"Setting"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type SettingOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    theme?: SortOrder
    language?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type SettingWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userId?: number
    AND?: SettingWhereInput | SettingWhereInput[]
    OR?: SettingWhereInput[]
    NOT?: SettingWhereInput | SettingWhereInput[]
    theme?: StringFilter<"Setting"> | string
    language?: StringFilter<"Setting"> | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "userId">

  export type SettingOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    theme?: SortOrder
    language?: SortOrder
    _count?: SettingCountOrderByAggregateInput
    _avg?: SettingAvgOrderByAggregateInput
    _max?: SettingMaxOrderByAggregateInput
    _min?: SettingMinOrderByAggregateInput
    _sum?: SettingSumOrderByAggregateInput
  }

  export type SettingScalarWhereWithAggregatesInput = {
    AND?: SettingScalarWhereWithAggregatesInput | SettingScalarWhereWithAggregatesInput[]
    OR?: SettingScalarWhereWithAggregatesInput[]
    NOT?: SettingScalarWhereWithAggregatesInput | SettingScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Setting"> | number
    userId?: IntWithAggregatesFilter<"Setting"> | number
    theme?: StringWithAggregatesFilter<"Setting"> | string
    language?: StringWithAggregatesFilter<"Setting"> | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: IntFilter<"AuditLog"> | number
    userId?: IntNullableFilter<"AuditLog"> | number | null
    action?: StringFilter<"AuditLog"> | string
    entity?: StringFilter<"AuditLog"> | string
    entityId?: IntNullableFilter<"AuditLog"> | number | null
    timestamp?: DateTimeFilter<"AuditLog"> | Date | string
    metadata?: JsonNullableFilter<"AuditLog">
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    action?: SortOrder
    entity?: SortOrder
    entityId?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    metadata?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    userId?: IntNullableFilter<"AuditLog"> | number | null
    action?: StringFilter<"AuditLog"> | string
    entity?: StringFilter<"AuditLog"> | string
    entityId?: IntNullableFilter<"AuditLog"> | number | null
    timestamp?: DateTimeFilter<"AuditLog"> | Date | string
    metadata?: JsonNullableFilter<"AuditLog">
    user?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrderInput | SortOrder
    action?: SortOrder
    entity?: SortOrder
    entityId?: SortOrderInput | SortOrder
    timestamp?: SortOrder
    metadata?: SortOrderInput | SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _avg?: AuditLogAvgOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
    _sum?: AuditLogSumOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"AuditLog"> | number
    userId?: IntNullableWithAggregatesFilter<"AuditLog"> | number | null
    action?: StringWithAggregatesFilter<"AuditLog"> | string
    entity?: StringWithAggregatesFilter<"AuditLog"> | string
    entityId?: IntNullableWithAggregatesFilter<"AuditLog"> | number | null
    timestamp?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
    metadata?: JsonNullableWithAggregatesFilter<"AuditLog">
  }

  export type LoginSessionWhereInput = {
    AND?: LoginSessionWhereInput | LoginSessionWhereInput[]
    OR?: LoginSessionWhereInput[]
    NOT?: LoginSessionWhereInput | LoginSessionWhereInput[]
    id?: IntFilter<"LoginSession"> | number
    userId?: IntFilter<"LoginSession"> | number
    ipAddress?: StringFilter<"LoginSession"> | string
    userAgent?: StringFilter<"LoginSession"> | string
    loginAt?: DateTimeFilter<"LoginSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type LoginSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    loginAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type LoginSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: LoginSessionWhereInput | LoginSessionWhereInput[]
    OR?: LoginSessionWhereInput[]
    NOT?: LoginSessionWhereInput | LoginSessionWhereInput[]
    userId?: IntFilter<"LoginSession"> | number
    ipAddress?: StringFilter<"LoginSession"> | string
    userAgent?: StringFilter<"LoginSession"> | string
    loginAt?: DateTimeFilter<"LoginSession"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type LoginSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    loginAt?: SortOrder
    _count?: LoginSessionCountOrderByAggregateInput
    _avg?: LoginSessionAvgOrderByAggregateInput
    _max?: LoginSessionMaxOrderByAggregateInput
    _min?: LoginSessionMinOrderByAggregateInput
    _sum?: LoginSessionSumOrderByAggregateInput
  }

  export type LoginSessionScalarWhereWithAggregatesInput = {
    AND?: LoginSessionScalarWhereWithAggregatesInput | LoginSessionScalarWhereWithAggregatesInput[]
    OR?: LoginSessionScalarWhereWithAggregatesInput[]
    NOT?: LoginSessionScalarWhereWithAggregatesInput | LoginSessionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"LoginSession"> | number
    userId?: IntWithAggregatesFilter<"LoginSession"> | number
    ipAddress?: StringWithAggregatesFilter<"LoginSession"> | string
    userAgent?: StringWithAggregatesFilter<"LoginSession"> | string
    loginAt?: DateTimeWithAggregatesFilter<"LoginSession"> | Date | string
  }

  export type RoleWhereInput = {
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    id?: IntFilter<"Role"> | number
    Rolename?: StringFilter<"Role"> | string
    description?: StringFilter<"Role"> | string
    isActive?: BoolFilter<"Role"> | boolean
    users?: UserListRelationFilter
    UserHospitalAccess?: UserHospitalAccessListRelationFilter
    permissions?: RolePermissionListRelationFilter
  }

  export type RoleOrderByWithRelationInput = {
    id?: SortOrder
    Rolename?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    users?: UserOrderByRelationAggregateInput
    UserHospitalAccess?: UserHospitalAccessOrderByRelationAggregateInput
    permissions?: RolePermissionOrderByRelationAggregateInput
  }

  export type RoleWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    Rolename?: string
    AND?: RoleWhereInput | RoleWhereInput[]
    OR?: RoleWhereInput[]
    NOT?: RoleWhereInput | RoleWhereInput[]
    description?: StringFilter<"Role"> | string
    isActive?: BoolFilter<"Role"> | boolean
    users?: UserListRelationFilter
    UserHospitalAccess?: UserHospitalAccessListRelationFilter
    permissions?: RolePermissionListRelationFilter
  }, "id" | "Rolename">

  export type RoleOrderByWithAggregationInput = {
    id?: SortOrder
    Rolename?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
    _count?: RoleCountOrderByAggregateInput
    _avg?: RoleAvgOrderByAggregateInput
    _max?: RoleMaxOrderByAggregateInput
    _min?: RoleMinOrderByAggregateInput
    _sum?: RoleSumOrderByAggregateInput
  }

  export type RoleScalarWhereWithAggregatesInput = {
    AND?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    OR?: RoleScalarWhereWithAggregatesInput[]
    NOT?: RoleScalarWhereWithAggregatesInput | RoleScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Role"> | number
    Rolename?: StringWithAggregatesFilter<"Role"> | string
    description?: StringWithAggregatesFilter<"Role"> | string
    isActive?: BoolWithAggregatesFilter<"Role"> | boolean
  }

  export type RolePermissionWhereInput = {
    AND?: RolePermissionWhereInput | RolePermissionWhereInput[]
    OR?: RolePermissionWhereInput[]
    NOT?: RolePermissionWhereInput | RolePermissionWhereInput[]
    id?: IntFilter<"RolePermission"> | number
    roleId?: IntFilter<"RolePermission"> | number
    permissionId?: IntFilter<"RolePermission"> | number
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    permission?: XOR<PermissionScalarRelationFilter, PermissionWhereInput>
  }

  export type RolePermissionOrderByWithRelationInput = {
    id?: SortOrder
    roleId?: SortOrder
    permissionId?: SortOrder
    role?: RoleOrderByWithRelationInput
    permission?: PermissionOrderByWithRelationInput
  }

  export type RolePermissionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    roleId_permissionId?: RolePermissionRoleIdPermissionIdCompoundUniqueInput
    AND?: RolePermissionWhereInput | RolePermissionWhereInput[]
    OR?: RolePermissionWhereInput[]
    NOT?: RolePermissionWhereInput | RolePermissionWhereInput[]
    roleId?: IntFilter<"RolePermission"> | number
    permissionId?: IntFilter<"RolePermission"> | number
    role?: XOR<RoleScalarRelationFilter, RoleWhereInput>
    permission?: XOR<PermissionScalarRelationFilter, PermissionWhereInput>
  }, "id" | "roleId_permissionId">

  export type RolePermissionOrderByWithAggregationInput = {
    id?: SortOrder
    roleId?: SortOrder
    permissionId?: SortOrder
    _count?: RolePermissionCountOrderByAggregateInput
    _avg?: RolePermissionAvgOrderByAggregateInput
    _max?: RolePermissionMaxOrderByAggregateInput
    _min?: RolePermissionMinOrderByAggregateInput
    _sum?: RolePermissionSumOrderByAggregateInput
  }

  export type RolePermissionScalarWhereWithAggregatesInput = {
    AND?: RolePermissionScalarWhereWithAggregatesInput | RolePermissionScalarWhereWithAggregatesInput[]
    OR?: RolePermissionScalarWhereWithAggregatesInput[]
    NOT?: RolePermissionScalarWhereWithAggregatesInput | RolePermissionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"RolePermission"> | number
    roleId?: IntWithAggregatesFilter<"RolePermission"> | number
    permissionId?: IntWithAggregatesFilter<"RolePermission"> | number
  }

  export type PermissionWhereInput = {
    AND?: PermissionWhereInput | PermissionWhereInput[]
    OR?: PermissionWhereInput[]
    NOT?: PermissionWhereInput | PermissionWhereInput[]
    id?: IntFilter<"Permission"> | number
    name?: StringFilter<"Permission"> | string
    displayName?: StringFilter<"Permission"> | string
    category?: StringFilter<"Permission"> | string
    description?: StringNullableFilter<"Permission"> | string | null
    roles?: RolePermissionListRelationFilter
  }

  export type PermissionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    category?: SortOrder
    description?: SortOrderInput | SortOrder
    roles?: RolePermissionOrderByRelationAggregateInput
  }

  export type PermissionWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    name?: string
    AND?: PermissionWhereInput | PermissionWhereInput[]
    OR?: PermissionWhereInput[]
    NOT?: PermissionWhereInput | PermissionWhereInput[]
    displayName?: StringFilter<"Permission"> | string
    category?: StringFilter<"Permission"> | string
    description?: StringNullableFilter<"Permission"> | string | null
    roles?: RolePermissionListRelationFilter
  }, "id" | "name">

  export type PermissionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    category?: SortOrder
    description?: SortOrderInput | SortOrder
    _count?: PermissionCountOrderByAggregateInput
    _avg?: PermissionAvgOrderByAggregateInput
    _max?: PermissionMaxOrderByAggregateInput
    _min?: PermissionMinOrderByAggregateInput
    _sum?: PermissionSumOrderByAggregateInput
  }

  export type PermissionScalarWhereWithAggregatesInput = {
    AND?: PermissionScalarWhereWithAggregatesInput | PermissionScalarWhereWithAggregatesInput[]
    OR?: PermissionScalarWhereWithAggregatesInput[]
    NOT?: PermissionScalarWhereWithAggregatesInput | PermissionScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Permission"> | number
    name?: StringWithAggregatesFilter<"Permission"> | string
    displayName?: StringWithAggregatesFilter<"Permission"> | string
    category?: StringWithAggregatesFilter<"Permission"> | string
    description?: StringNullableWithAggregatesFilter<"Permission"> | string | null
  }

  export type UserCreateInput = {
    title: $Enums.Title
    imageUrl: string
    firstName: string
    lastName: string
    gender: string
    email: string
    mobile: string
    passwordHash: string
    isActive?: boolean
    hashedRefreshToken: string
    dateOfBirth: Date | string
    deletedAt?: Date | string | null
    role: RoleCreateNestedOneWithoutUsersInput
    organization: OrganizationCreateNestedOneWithoutUsersInput
    settings?: SettingCreateNestedOneWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    loginSessions?: LoginSessionCreateNestedManyWithoutUserInput
    AdminAccess?: UserHospitalAccessCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    title: $Enums.Title
    imageUrl: string
    firstName: string
    lastName: string
    gender: string
    email: string
    mobile: string
    passwordHash: string
    isActive?: boolean
    hashedRefreshToken: string
    dateOfBirth: Date | string
    roleId: number
    organizationId: number
    deletedAt?: Date | string | null
    settings?: SettingUncheckedCreateNestedOneWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    loginSessions?: LoginSessionUncheckedCreateNestedManyWithoutUserInput
    AdminAccess?: UserHospitalAccessUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    title?: EnumTitleFieldUpdateOperationsInput | $Enums.Title
    imageUrl?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    hashedRefreshToken?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: RoleUpdateOneRequiredWithoutUsersNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutUsersNestedInput
    settings?: SettingUpdateOneWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    loginSessions?: LoginSessionUpdateManyWithoutUserNestedInput
    AdminAccess?: UserHospitalAccessUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: EnumTitleFieldUpdateOperationsInput | $Enums.Title
    imageUrl?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    hashedRefreshToken?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    roleId?: IntFieldUpdateOperationsInput | number
    organizationId?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settings?: SettingUncheckedUpdateOneWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    loginSessions?: LoginSessionUncheckedUpdateManyWithoutUserNestedInput
    AdminAccess?: UserHospitalAccessUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    title: $Enums.Title
    imageUrl: string
    firstName: string
    lastName: string
    gender: string
    email: string
    mobile: string
    passwordHash: string
    isActive?: boolean
    hashedRefreshToken: string
    dateOfBirth: Date | string
    roleId: number
    organizationId: number
    deletedAt?: Date | string | null
  }

  export type UserUpdateManyMutationInput = {
    title?: EnumTitleFieldUpdateOperationsInput | $Enums.Title
    imageUrl?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    hashedRefreshToken?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: EnumTitleFieldUpdateOperationsInput | $Enums.Title
    imageUrl?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    hashedRefreshToken?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    roleId?: IntFieldUpdateOperationsInput | number
    organizationId?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type OrganizationCreateInput = {
    OrganizationName: string
    Organizationcode: string
    logoUrl: string
    email: string
    contactNumber: string
    Orgnizationtype?: $Enums.OrganizationType | null
    website: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    country: string
    postalCode: string
    registrationNo: string
    establishedOn: Date | string
    industryType: string
    status?: $Enums.Hospital_Org_status
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    hospitals?: HospitalCreateNestedManyWithoutOrganizationInput
    users?: UserCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateInput = {
    id?: number
    OrganizationName: string
    Organizationcode: string
    logoUrl: string
    email: string
    contactNumber: string
    Orgnizationtype?: $Enums.OrganizationType | null
    website: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    country: string
    postalCode: string
    registrationNo: string
    establishedOn: Date | string
    industryType: string
    status?: $Enums.Hospital_Org_status
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    hospitals?: HospitalUncheckedCreateNestedManyWithoutOrganizationInput
    users?: UserUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUpdateInput = {
    OrganizationName?: StringFieldUpdateOperationsInput | string
    Organizationcode?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    Orgnizationtype?: NullableEnumOrganizationTypeFieldUpdateOperationsInput | $Enums.OrganizationType | null
    website?: StringFieldUpdateOperationsInput | string
    addressLine1?: StringFieldUpdateOperationsInput | string
    addressLine2?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    establishedOn?: DateTimeFieldUpdateOperationsInput | Date | string
    industryType?: StringFieldUpdateOperationsInput | string
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hospitals?: HospitalUpdateManyWithoutOrganizationNestedInput
    users?: UserUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    OrganizationName?: StringFieldUpdateOperationsInput | string
    Organizationcode?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    Orgnizationtype?: NullableEnumOrganizationTypeFieldUpdateOperationsInput | $Enums.OrganizationType | null
    website?: StringFieldUpdateOperationsInput | string
    addressLine1?: StringFieldUpdateOperationsInput | string
    addressLine2?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    establishedOn?: DateTimeFieldUpdateOperationsInput | Date | string
    industryType?: StringFieldUpdateOperationsInput | string
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hospitals?: HospitalUncheckedUpdateManyWithoutOrganizationNestedInput
    users?: UserUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationCreateManyInput = {
    id?: number
    OrganizationName: string
    Organizationcode: string
    logoUrl: string
    email: string
    contactNumber: string
    Orgnizationtype?: $Enums.OrganizationType | null
    website: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    country: string
    postalCode: string
    registrationNo: string
    establishedOn: Date | string
    industryType: string
    status?: $Enums.Hospital_Org_status
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OrganizationUpdateManyMutationInput = {
    OrganizationName?: StringFieldUpdateOperationsInput | string
    Organizationcode?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    Orgnizationtype?: NullableEnumOrganizationTypeFieldUpdateOperationsInput | $Enums.OrganizationType | null
    website?: StringFieldUpdateOperationsInput | string
    addressLine1?: StringFieldUpdateOperationsInput | string
    addressLine2?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    establishedOn?: DateTimeFieldUpdateOperationsInput | Date | string
    industryType?: StringFieldUpdateOperationsInput | string
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OrganizationUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    OrganizationName?: StringFieldUpdateOperationsInput | string
    Organizationcode?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    Orgnizationtype?: NullableEnumOrganizationTypeFieldUpdateOperationsInput | $Enums.OrganizationType | null
    website?: StringFieldUpdateOperationsInput | string
    addressLine1?: StringFieldUpdateOperationsInput | string
    addressLine2?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    establishedOn?: DateTimeFieldUpdateOperationsInput | Date | string
    industryType?: StringFieldUpdateOperationsInput | string
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HospitalCreateInput = {
    name: string
    hospitalCode: string
    ParentHospitalCode?: string | null
    Organizationcode?: string | null
    SpecializationType: $Enums.SpecializationType
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    contactNumber: string
    email: string
    website: string
    logoUrl: string
    latitude: number
    longitude: number
    status?: $Enums.Hospital_Org_status
    level: $Enums.HospitalLevel
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    parentHospital?: HospitalCreateNestedOneWithoutChildHospitalInput
    childHospital?: HospitalCreateNestedManyWithoutParentHospitalInput
    Organization: OrganizationCreateNestedOneWithoutHospitalsInput
    users?: UserHospitalAccessCreateNestedManyWithoutHospitalInput
  }

  export type HospitalUncheckedCreateInput = {
    id?: number
    name: string
    hospitalCode: string
    ParentHospitalCode?: string | null
    Organizationcode?: string | null
    SpecializationType: $Enums.SpecializationType
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    contactNumber: string
    email: string
    website: string
    logoUrl: string
    latitude: number
    longitude: number
    status?: $Enums.Hospital_Org_status
    level: $Enums.HospitalLevel
    parentHospitalId?: number | null
    organizationId: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    childHospital?: HospitalUncheckedCreateNestedManyWithoutParentHospitalInput
    users?: UserHospitalAccessUncheckedCreateNestedManyWithoutHospitalInput
  }

  export type HospitalUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    hospitalCode?: StringFieldUpdateOperationsInput | string
    ParentHospitalCode?: NullableStringFieldUpdateOperationsInput | string | null
    Organizationcode?: NullableStringFieldUpdateOperationsInput | string | null
    SpecializationType?: EnumSpecializationTypeFieldUpdateOperationsInput | $Enums.SpecializationType
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    level?: EnumHospitalLevelFieldUpdateOperationsInput | $Enums.HospitalLevel
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentHospital?: HospitalUpdateOneWithoutChildHospitalNestedInput
    childHospital?: HospitalUpdateManyWithoutParentHospitalNestedInput
    Organization?: OrganizationUpdateOneRequiredWithoutHospitalsNestedInput
    users?: UserHospitalAccessUpdateManyWithoutHospitalNestedInput
  }

  export type HospitalUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    hospitalCode?: StringFieldUpdateOperationsInput | string
    ParentHospitalCode?: NullableStringFieldUpdateOperationsInput | string | null
    Organizationcode?: NullableStringFieldUpdateOperationsInput | string | null
    SpecializationType?: EnumSpecializationTypeFieldUpdateOperationsInput | $Enums.SpecializationType
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    level?: EnumHospitalLevelFieldUpdateOperationsInput | $Enums.HospitalLevel
    parentHospitalId?: NullableIntFieldUpdateOperationsInput | number | null
    organizationId?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    childHospital?: HospitalUncheckedUpdateManyWithoutParentHospitalNestedInput
    users?: UserHospitalAccessUncheckedUpdateManyWithoutHospitalNestedInput
  }

  export type HospitalCreateManyInput = {
    id?: number
    name: string
    hospitalCode: string
    ParentHospitalCode?: string | null
    Organizationcode?: string | null
    SpecializationType: $Enums.SpecializationType
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    contactNumber: string
    email: string
    website: string
    logoUrl: string
    latitude: number
    longitude: number
    status?: $Enums.Hospital_Org_status
    level: $Enums.HospitalLevel
    parentHospitalId?: number | null
    organizationId: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type HospitalUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    hospitalCode?: StringFieldUpdateOperationsInput | string
    ParentHospitalCode?: NullableStringFieldUpdateOperationsInput | string | null
    Organizationcode?: NullableStringFieldUpdateOperationsInput | string | null
    SpecializationType?: EnumSpecializationTypeFieldUpdateOperationsInput | $Enums.SpecializationType
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    level?: EnumHospitalLevelFieldUpdateOperationsInput | $Enums.HospitalLevel
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type HospitalUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    hospitalCode?: StringFieldUpdateOperationsInput | string
    ParentHospitalCode?: NullableStringFieldUpdateOperationsInput | string | null
    Organizationcode?: NullableStringFieldUpdateOperationsInput | string | null
    SpecializationType?: EnumSpecializationTypeFieldUpdateOperationsInput | $Enums.SpecializationType
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    level?: EnumHospitalLevelFieldUpdateOperationsInput | $Enums.HospitalLevel
    parentHospitalId?: NullableIntFieldUpdateOperationsInput | number | null
    organizationId?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserHospitalAccessCreateInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAdminAccessInput
    hospital: HospitalCreateNestedOneWithoutUsersInput
    role: RoleCreateNestedOneWithoutUserHospitalAccessInput
  }

  export type UserHospitalAccessUncheckedCreateInput = {
    id?: number
    userId: number
    hospitalId: number
    roleId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserHospitalAccessUpdateInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAdminAccessNestedInput
    hospital?: HospitalUpdateOneRequiredWithoutUsersNestedInput
    role?: RoleUpdateOneRequiredWithoutUserHospitalAccessNestedInput
  }

  export type UserHospitalAccessUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    hospitalId?: IntFieldUpdateOperationsInput | number
    roleId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserHospitalAccessCreateManyInput = {
    id?: number
    userId: number
    hospitalId: number
    roleId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserHospitalAccessUpdateManyMutationInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserHospitalAccessUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    hospitalId?: IntFieldUpdateOperationsInput | number
    roleId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SettingCreateInput = {
    theme?: string
    language?: string
    user: UserCreateNestedOneWithoutSettingsInput
  }

  export type SettingUncheckedCreateInput = {
    id?: number
    userId: number
    theme?: string
    language?: string
  }

  export type SettingUpdateInput = {
    theme?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
    user?: UserUpdateOneRequiredWithoutSettingsNestedInput
  }

  export type SettingUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    theme?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
  }

  export type SettingCreateManyInput = {
    id?: number
    userId: number
    theme?: string
    language?: string
  }

  export type SettingUpdateManyMutationInput = {
    theme?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
  }

  export type SettingUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    theme?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
  }

  export type AuditLogCreateInput = {
    action: string
    entity: string
    entityId?: number | null
    timestamp?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    user?: UserCreateNestedOneWithoutAuditLogsInput
  }

  export type AuditLogUncheckedCreateInput = {
    id?: number
    userId?: number | null
    action: string
    entity: string
    entityId?: number | null
    timestamp?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogUpdateInput = {
    action?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: NullableIntFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
    user?: UserUpdateOneWithoutAuditLogsNestedInput
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    action?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: NullableIntFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogCreateManyInput = {
    id?: number
    userId?: number | null
    action: string
    entity: string
    entityId?: number | null
    timestamp?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogUpdateManyMutationInput = {
    action?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: NullableIntFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: NullableIntFieldUpdateOperationsInput | number | null
    action?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: NullableIntFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type LoginSessionCreateInput = {
    ipAddress: string
    userAgent: string
    loginAt?: Date | string
    user: UserCreateNestedOneWithoutLoginSessionsInput
  }

  export type LoginSessionUncheckedCreateInput = {
    id?: number
    userId: number
    ipAddress: string
    userAgent: string
    loginAt?: Date | string
  }

  export type LoginSessionUpdateInput = {
    ipAddress?: StringFieldUpdateOperationsInput | string
    userAgent?: StringFieldUpdateOperationsInput | string
    loginAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLoginSessionsNestedInput
  }

  export type LoginSessionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    ipAddress?: StringFieldUpdateOperationsInput | string
    userAgent?: StringFieldUpdateOperationsInput | string
    loginAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginSessionCreateManyInput = {
    id?: number
    userId: number
    ipAddress: string
    userAgent: string
    loginAt?: Date | string
  }

  export type LoginSessionUpdateManyMutationInput = {
    ipAddress?: StringFieldUpdateOperationsInput | string
    userAgent?: StringFieldUpdateOperationsInput | string
    loginAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginSessionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    ipAddress?: StringFieldUpdateOperationsInput | string
    userAgent?: StringFieldUpdateOperationsInput | string
    loginAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RoleCreateInput = {
    Rolename: string
    description: string
    isActive?: boolean
    users?: UserCreateNestedManyWithoutRoleInput
    UserHospitalAccess?: UserHospitalAccessCreateNestedManyWithoutRoleInput
    permissions?: RolePermissionCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateInput = {
    id?: number
    Rolename: string
    description: string
    isActive?: boolean
    users?: UserUncheckedCreateNestedManyWithoutRoleInput
    UserHospitalAccess?: UserHospitalAccessUncheckedCreateNestedManyWithoutRoleInput
    permissions?: RolePermissionUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleUpdateInput = {
    Rolename?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUpdateManyWithoutRoleNestedInput
    UserHospitalAccess?: UserHospitalAccessUpdateManyWithoutRoleNestedInput
    permissions?: RolePermissionUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    Rolename?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUncheckedUpdateManyWithoutRoleNestedInput
    UserHospitalAccess?: UserHospitalAccessUncheckedUpdateManyWithoutRoleNestedInput
    permissions?: RolePermissionUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type RoleCreateManyInput = {
    id?: number
    Rolename: string
    description: string
    isActive?: boolean
  }

  export type RoleUpdateManyMutationInput = {
    Rolename?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type RoleUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    Rolename?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
  }

  export type RolePermissionCreateInput = {
    role: RoleCreateNestedOneWithoutPermissionsInput
    permission: PermissionCreateNestedOneWithoutRolesInput
  }

  export type RolePermissionUncheckedCreateInput = {
    id?: number
    roleId: number
    permissionId: number
  }

  export type RolePermissionUpdateInput = {
    role?: RoleUpdateOneRequiredWithoutPermissionsNestedInput
    permission?: PermissionUpdateOneRequiredWithoutRolesNestedInput
  }

  export type RolePermissionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    roleId?: IntFieldUpdateOperationsInput | number
    permissionId?: IntFieldUpdateOperationsInput | number
  }

  export type RolePermissionCreateManyInput = {
    id?: number
    roleId: number
    permissionId: number
  }

  export type RolePermissionUpdateManyMutationInput = {

  }

  export type RolePermissionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    roleId?: IntFieldUpdateOperationsInput | number
    permissionId?: IntFieldUpdateOperationsInput | number
  }

  export type PermissionCreateInput = {
    name: string
    displayName: string
    category: string
    description?: string | null
    roles?: RolePermissionCreateNestedManyWithoutPermissionInput
  }

  export type PermissionUncheckedCreateInput = {
    id?: number
    name: string
    displayName: string
    category: string
    description?: string | null
    roles?: RolePermissionUncheckedCreateNestedManyWithoutPermissionInput
  }

  export type PermissionUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: RolePermissionUpdateManyWithoutPermissionNestedInput
  }

  export type PermissionUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    roles?: RolePermissionUncheckedUpdateManyWithoutPermissionNestedInput
  }

  export type PermissionCreateManyInput = {
    id?: number
    name: string
    displayName: string
    category: string
    description?: string | null
  }

  export type PermissionUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PermissionUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumTitleFilter<$PrismaModel = never> = {
    equals?: $Enums.Title | EnumTitleFieldRefInput<$PrismaModel>
    in?: $Enums.Title[] | ListEnumTitleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Title[] | ListEnumTitleFieldRefInput<$PrismaModel>
    not?: NestedEnumTitleFilter<$PrismaModel> | $Enums.Title
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type RoleScalarRelationFilter = {
    is?: RoleWhereInput
    isNot?: RoleWhereInput
  }

  export type OrganizationScalarRelationFilter = {
    is?: OrganizationWhereInput
    isNot?: OrganizationWhereInput
  }

  export type SettingNullableScalarRelationFilter = {
    is?: SettingWhereInput | null
    isNot?: SettingWhereInput | null
  }

  export type AuditLogListRelationFilter = {
    every?: AuditLogWhereInput
    some?: AuditLogWhereInput
    none?: AuditLogWhereInput
  }

  export type LoginSessionListRelationFilter = {
    every?: LoginSessionWhereInput
    some?: LoginSessionWhereInput
    none?: LoginSessionWhereInput
  }

  export type UserHospitalAccessListRelationFilter = {
    every?: UserHospitalAccessWhereInput
    some?: UserHospitalAccessWhereInput
    none?: UserHospitalAccessWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AuditLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LoginSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserHospitalAccessOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    imageUrl?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    gender?: SortOrder
    email?: SortOrder
    mobile?: SortOrder
    passwordHash?: SortOrder
    isActive?: SortOrder
    hashedRefreshToken?: SortOrder
    dateOfBirth?: SortOrder
    roleId?: SortOrder
    organizationId?: SortOrder
    deletedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    organizationId?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    imageUrl?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    gender?: SortOrder
    email?: SortOrder
    mobile?: SortOrder
    passwordHash?: SortOrder
    isActive?: SortOrder
    hashedRefreshToken?: SortOrder
    dateOfBirth?: SortOrder
    roleId?: SortOrder
    organizationId?: SortOrder
    deletedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    imageUrl?: SortOrder
    firstName?: SortOrder
    lastName?: SortOrder
    gender?: SortOrder
    email?: SortOrder
    mobile?: SortOrder
    passwordHash?: SortOrder
    isActive?: SortOrder
    hashedRefreshToken?: SortOrder
    dateOfBirth?: SortOrder
    roleId?: SortOrder
    organizationId?: SortOrder
    deletedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    organizationId?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumTitleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Title | EnumTitleFieldRefInput<$PrismaModel>
    in?: $Enums.Title[] | ListEnumTitleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Title[] | ListEnumTitleFieldRefInput<$PrismaModel>
    not?: NestedEnumTitleWithAggregatesFilter<$PrismaModel> | $Enums.Title
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTitleFilter<$PrismaModel>
    _max?: NestedEnumTitleFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumOrganizationTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.OrganizationType | EnumOrganizationTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.OrganizationType[] | ListEnumOrganizationTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.OrganizationType[] | ListEnumOrganizationTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumOrganizationTypeNullableFilter<$PrismaModel> | $Enums.OrganizationType | null
  }

  export type EnumHospital_Org_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.Hospital_Org_status | EnumHospital_Org_statusFieldRefInput<$PrismaModel>
    in?: $Enums.Hospital_Org_status[] | ListEnumHospital_Org_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Hospital_Org_status[] | ListEnumHospital_Org_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumHospital_Org_statusFilter<$PrismaModel> | $Enums.Hospital_Org_status
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type HospitalListRelationFilter = {
    every?: HospitalWhereInput
    some?: HospitalWhereInput
    none?: HospitalWhereInput
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type HospitalOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OrganizationCountOrderByAggregateInput = {
    id?: SortOrder
    OrganizationName?: SortOrder
    Organizationcode?: SortOrder
    logoUrl?: SortOrder
    email?: SortOrder
    contactNumber?: SortOrder
    Orgnizationtype?: SortOrder
    website?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    postalCode?: SortOrder
    registrationNo?: SortOrder
    establishedOn?: SortOrder
    industryType?: SortOrder
    status?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrganizationAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type OrganizationMaxOrderByAggregateInput = {
    id?: SortOrder
    OrganizationName?: SortOrder
    Organizationcode?: SortOrder
    logoUrl?: SortOrder
    email?: SortOrder
    contactNumber?: SortOrder
    Orgnizationtype?: SortOrder
    website?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    postalCode?: SortOrder
    registrationNo?: SortOrder
    establishedOn?: SortOrder
    industryType?: SortOrder
    status?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrganizationMinOrderByAggregateInput = {
    id?: SortOrder
    OrganizationName?: SortOrder
    Organizationcode?: SortOrder
    logoUrl?: SortOrder
    email?: SortOrder
    contactNumber?: SortOrder
    Orgnizationtype?: SortOrder
    website?: SortOrder
    addressLine1?: SortOrder
    addressLine2?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    postalCode?: SortOrder
    registrationNo?: SortOrder
    establishedOn?: SortOrder
    industryType?: SortOrder
    status?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OrganizationSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumOrganizationTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrganizationType | EnumOrganizationTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.OrganizationType[] | ListEnumOrganizationTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.OrganizationType[] | ListEnumOrganizationTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumOrganizationTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.OrganizationType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumOrganizationTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumOrganizationTypeNullableFilter<$PrismaModel>
  }

  export type EnumHospital_Org_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Hospital_Org_status | EnumHospital_Org_statusFieldRefInput<$PrismaModel>
    in?: $Enums.Hospital_Org_status[] | ListEnumHospital_Org_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Hospital_Org_status[] | ListEnumHospital_Org_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumHospital_Org_statusWithAggregatesFilter<$PrismaModel> | $Enums.Hospital_Org_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumHospital_Org_statusFilter<$PrismaModel>
    _max?: NestedEnumHospital_Org_statusFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumSpecializationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SpecializationType | EnumSpecializationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SpecializationType[] | ListEnumSpecializationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SpecializationType[] | ListEnumSpecializationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSpecializationTypeFilter<$PrismaModel> | $Enums.SpecializationType
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type EnumHospitalLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.HospitalLevel | EnumHospitalLevelFieldRefInput<$PrismaModel>
    in?: $Enums.HospitalLevel[] | ListEnumHospitalLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.HospitalLevel[] | ListEnumHospitalLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumHospitalLevelFilter<$PrismaModel> | $Enums.HospitalLevel
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type HospitalNullableScalarRelationFilter = {
    is?: HospitalWhereInput | null
    isNot?: HospitalWhereInput | null
  }

  export type HospitalCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    hospitalCode?: SortOrder
    ParentHospitalCode?: SortOrder
    Organizationcode?: SortOrder
    SpecializationType?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    postalCode?: SortOrder
    contactNumber?: SortOrder
    email?: SortOrder
    website?: SortOrder
    logoUrl?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    status?: SortOrder
    level?: SortOrder
    parentHospitalId?: SortOrder
    organizationId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type HospitalAvgOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    parentHospitalId?: SortOrder
    organizationId?: SortOrder
  }

  export type HospitalMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    hospitalCode?: SortOrder
    ParentHospitalCode?: SortOrder
    Organizationcode?: SortOrder
    SpecializationType?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    postalCode?: SortOrder
    contactNumber?: SortOrder
    email?: SortOrder
    website?: SortOrder
    logoUrl?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    status?: SortOrder
    level?: SortOrder
    parentHospitalId?: SortOrder
    organizationId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type HospitalMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    hospitalCode?: SortOrder
    ParentHospitalCode?: SortOrder
    Organizationcode?: SortOrder
    SpecializationType?: SortOrder
    address?: SortOrder
    city?: SortOrder
    state?: SortOrder
    country?: SortOrder
    postalCode?: SortOrder
    contactNumber?: SortOrder
    email?: SortOrder
    website?: SortOrder
    logoUrl?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    status?: SortOrder
    level?: SortOrder
    parentHospitalId?: SortOrder
    organizationId?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    deletedAt?: SortOrder
  }

  export type HospitalSumOrderByAggregateInput = {
    id?: SortOrder
    latitude?: SortOrder
    longitude?: SortOrder
    parentHospitalId?: SortOrder
    organizationId?: SortOrder
  }

  export type EnumSpecializationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SpecializationType | EnumSpecializationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SpecializationType[] | ListEnumSpecializationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SpecializationType[] | ListEnumSpecializationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSpecializationTypeWithAggregatesFilter<$PrismaModel> | $Enums.SpecializationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSpecializationTypeFilter<$PrismaModel>
    _max?: NestedEnumSpecializationTypeFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type EnumHospitalLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HospitalLevel | EnumHospitalLevelFieldRefInput<$PrismaModel>
    in?: $Enums.HospitalLevel[] | ListEnumHospitalLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.HospitalLevel[] | ListEnumHospitalLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumHospitalLevelWithAggregatesFilter<$PrismaModel> | $Enums.HospitalLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumHospitalLevelFilter<$PrismaModel>
    _max?: NestedEnumHospitalLevelFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type HospitalScalarRelationFilter = {
    is?: HospitalWhereInput
    isNot?: HospitalWhereInput
  }

  export type UserHospitalAccessUserIdHospitalIdCompoundUniqueInput = {
    userId: number
    hospitalId: number
  }

  export type UserHospitalAccessCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    hospitalId?: SortOrder
    roleId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserHospitalAccessAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    hospitalId?: SortOrder
    roleId?: SortOrder
  }

  export type UserHospitalAccessMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    hospitalId?: SortOrder
    roleId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserHospitalAccessMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    hospitalId?: SortOrder
    roleId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserHospitalAccessSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    hospitalId?: SortOrder
    roleId?: SortOrder
  }

  export type SettingCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    theme?: SortOrder
    language?: SortOrder
  }

  export type SettingAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type SettingMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    theme?: SortOrder
    language?: SortOrder
  }

  export type SettingMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    theme?: SortOrder
    language?: SortOrder
  }

  export type SettingSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entity?: SortOrder
    entityId?: SortOrder
    timestamp?: SortOrder
    metadata?: SortOrder
  }

  export type AuditLogAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    entityId?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entity?: SortOrder
    entityId?: SortOrder
    timestamp?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    action?: SortOrder
    entity?: SortOrder
    entityId?: SortOrder
    timestamp?: SortOrder
  }

  export type AuditLogSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    entityId?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type LoginSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    loginAt?: SortOrder
  }

  export type LoginSessionAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type LoginSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    loginAt?: SortOrder
  }

  export type LoginSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
    loginAt?: SortOrder
  }

  export type LoginSessionSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type RolePermissionListRelationFilter = {
    every?: RolePermissionWhereInput
    some?: RolePermissionWhereInput
    none?: RolePermissionWhereInput
  }

  export type RolePermissionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type RoleCountOrderByAggregateInput = {
    id?: SortOrder
    Rolename?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
  }

  export type RoleAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RoleMaxOrderByAggregateInput = {
    id?: SortOrder
    Rolename?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
  }

  export type RoleMinOrderByAggregateInput = {
    id?: SortOrder
    Rolename?: SortOrder
    description?: SortOrder
    isActive?: SortOrder
  }

  export type RoleSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PermissionScalarRelationFilter = {
    is?: PermissionWhereInput
    isNot?: PermissionWhereInput
  }

  export type RolePermissionRoleIdPermissionIdCompoundUniqueInput = {
    roleId: number
    permissionId: number
  }

  export type RolePermissionCountOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    permissionId?: SortOrder
  }

  export type RolePermissionAvgOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    permissionId?: SortOrder
  }

  export type RolePermissionMaxOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    permissionId?: SortOrder
  }

  export type RolePermissionMinOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    permissionId?: SortOrder
  }

  export type RolePermissionSumOrderByAggregateInput = {
    id?: SortOrder
    roleId?: SortOrder
    permissionId?: SortOrder
  }

  export type PermissionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    category?: SortOrder
    description?: SortOrder
  }

  export type PermissionAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PermissionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    category?: SortOrder
    description?: SortOrder
  }

  export type PermissionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    displayName?: SortOrder
    category?: SortOrder
    description?: SortOrder
  }

  export type PermissionSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type RoleCreateNestedOneWithoutUsersInput = {
    create?: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
    connectOrCreate?: RoleCreateOrConnectWithoutUsersInput
    connect?: RoleWhereUniqueInput
  }

  export type OrganizationCreateNestedOneWithoutUsersInput = {
    create?: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutUsersInput
    connect?: OrganizationWhereUniqueInput
  }

  export type SettingCreateNestedOneWithoutUserInput = {
    create?: XOR<SettingCreateWithoutUserInput, SettingUncheckedCreateWithoutUserInput>
    connectOrCreate?: SettingCreateOrConnectWithoutUserInput
    connect?: SettingWhereUniqueInput
  }

  export type AuditLogCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type LoginSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<LoginSessionCreateWithoutUserInput, LoginSessionUncheckedCreateWithoutUserInput> | LoginSessionCreateWithoutUserInput[] | LoginSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoginSessionCreateOrConnectWithoutUserInput | LoginSessionCreateOrConnectWithoutUserInput[]
    createMany?: LoginSessionCreateManyUserInputEnvelope
    connect?: LoginSessionWhereUniqueInput | LoginSessionWhereUniqueInput[]
  }

  export type UserHospitalAccessCreateNestedManyWithoutUserInput = {
    create?: XOR<UserHospitalAccessCreateWithoutUserInput, UserHospitalAccessUncheckedCreateWithoutUserInput> | UserHospitalAccessCreateWithoutUserInput[] | UserHospitalAccessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserHospitalAccessCreateOrConnectWithoutUserInput | UserHospitalAccessCreateOrConnectWithoutUserInput[]
    createMany?: UserHospitalAccessCreateManyUserInputEnvelope
    connect?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
  }

  export type SettingUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<SettingCreateWithoutUserInput, SettingUncheckedCreateWithoutUserInput>
    connectOrCreate?: SettingCreateOrConnectWithoutUserInput
    connect?: SettingWhereUniqueInput
  }

  export type AuditLogUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
  }

  export type LoginSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<LoginSessionCreateWithoutUserInput, LoginSessionUncheckedCreateWithoutUserInput> | LoginSessionCreateWithoutUserInput[] | LoginSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoginSessionCreateOrConnectWithoutUserInput | LoginSessionCreateOrConnectWithoutUserInput[]
    createMany?: LoginSessionCreateManyUserInputEnvelope
    connect?: LoginSessionWhereUniqueInput | LoginSessionWhereUniqueInput[]
  }

  export type UserHospitalAccessUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserHospitalAccessCreateWithoutUserInput, UserHospitalAccessUncheckedCreateWithoutUserInput> | UserHospitalAccessCreateWithoutUserInput[] | UserHospitalAccessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserHospitalAccessCreateOrConnectWithoutUserInput | UserHospitalAccessCreateOrConnectWithoutUserInput[]
    createMany?: UserHospitalAccessCreateManyUserInputEnvelope
    connect?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
  }

  export type EnumTitleFieldUpdateOperationsInput = {
    set?: $Enums.Title
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type RoleUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
    connectOrCreate?: RoleCreateOrConnectWithoutUsersInput
    upsert?: RoleUpsertWithoutUsersInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutUsersInput, RoleUpdateWithoutUsersInput>, RoleUncheckedUpdateWithoutUsersInput>
  }

  export type OrganizationUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutUsersInput
    upsert?: OrganizationUpsertWithoutUsersInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutUsersInput, OrganizationUpdateWithoutUsersInput>, OrganizationUncheckedUpdateWithoutUsersInput>
  }

  export type SettingUpdateOneWithoutUserNestedInput = {
    create?: XOR<SettingCreateWithoutUserInput, SettingUncheckedCreateWithoutUserInput>
    connectOrCreate?: SettingCreateOrConnectWithoutUserInput
    upsert?: SettingUpsertWithoutUserInput
    disconnect?: SettingWhereInput | boolean
    delete?: SettingWhereInput | boolean
    connect?: SettingWhereUniqueInput
    update?: XOR<XOR<SettingUpdateToOneWithWhereWithoutUserInput, SettingUpdateWithoutUserInput>, SettingUncheckedUpdateWithoutUserInput>
  }

  export type AuditLogUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type LoginSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<LoginSessionCreateWithoutUserInput, LoginSessionUncheckedCreateWithoutUserInput> | LoginSessionCreateWithoutUserInput[] | LoginSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoginSessionCreateOrConnectWithoutUserInput | LoginSessionCreateOrConnectWithoutUserInput[]
    upsert?: LoginSessionUpsertWithWhereUniqueWithoutUserInput | LoginSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LoginSessionCreateManyUserInputEnvelope
    set?: LoginSessionWhereUniqueInput | LoginSessionWhereUniqueInput[]
    disconnect?: LoginSessionWhereUniqueInput | LoginSessionWhereUniqueInput[]
    delete?: LoginSessionWhereUniqueInput | LoginSessionWhereUniqueInput[]
    connect?: LoginSessionWhereUniqueInput | LoginSessionWhereUniqueInput[]
    update?: LoginSessionUpdateWithWhereUniqueWithoutUserInput | LoginSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LoginSessionUpdateManyWithWhereWithoutUserInput | LoginSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LoginSessionScalarWhereInput | LoginSessionScalarWhereInput[]
  }

  export type UserHospitalAccessUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserHospitalAccessCreateWithoutUserInput, UserHospitalAccessUncheckedCreateWithoutUserInput> | UserHospitalAccessCreateWithoutUserInput[] | UserHospitalAccessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserHospitalAccessCreateOrConnectWithoutUserInput | UserHospitalAccessCreateOrConnectWithoutUserInput[]
    upsert?: UserHospitalAccessUpsertWithWhereUniqueWithoutUserInput | UserHospitalAccessUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserHospitalAccessCreateManyUserInputEnvelope
    set?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    disconnect?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    delete?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    connect?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    update?: UserHospitalAccessUpdateWithWhereUniqueWithoutUserInput | UserHospitalAccessUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserHospitalAccessUpdateManyWithWhereWithoutUserInput | UserHospitalAccessUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserHospitalAccessScalarWhereInput | UserHospitalAccessScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SettingUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<SettingCreateWithoutUserInput, SettingUncheckedCreateWithoutUserInput>
    connectOrCreate?: SettingCreateOrConnectWithoutUserInput
    upsert?: SettingUpsertWithoutUserInput
    disconnect?: SettingWhereInput | boolean
    delete?: SettingWhereInput | boolean
    connect?: SettingWhereUniqueInput
    update?: XOR<XOR<SettingUpdateToOneWithWhereWithoutUserInput, SettingUpdateWithoutUserInput>, SettingUncheckedUpdateWithoutUserInput>
  }

  export type AuditLogUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput> | AuditLogCreateWithoutUserInput[] | AuditLogUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AuditLogCreateOrConnectWithoutUserInput | AuditLogCreateOrConnectWithoutUserInput[]
    upsert?: AuditLogUpsertWithWhereUniqueWithoutUserInput | AuditLogUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AuditLogCreateManyUserInputEnvelope
    set?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    disconnect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    delete?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    connect?: AuditLogWhereUniqueInput | AuditLogWhereUniqueInput[]
    update?: AuditLogUpdateWithWhereUniqueWithoutUserInput | AuditLogUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AuditLogUpdateManyWithWhereWithoutUserInput | AuditLogUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
  }

  export type LoginSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<LoginSessionCreateWithoutUserInput, LoginSessionUncheckedCreateWithoutUserInput> | LoginSessionCreateWithoutUserInput[] | LoginSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LoginSessionCreateOrConnectWithoutUserInput | LoginSessionCreateOrConnectWithoutUserInput[]
    upsert?: LoginSessionUpsertWithWhereUniqueWithoutUserInput | LoginSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LoginSessionCreateManyUserInputEnvelope
    set?: LoginSessionWhereUniqueInput | LoginSessionWhereUniqueInput[]
    disconnect?: LoginSessionWhereUniqueInput | LoginSessionWhereUniqueInput[]
    delete?: LoginSessionWhereUniqueInput | LoginSessionWhereUniqueInput[]
    connect?: LoginSessionWhereUniqueInput | LoginSessionWhereUniqueInput[]
    update?: LoginSessionUpdateWithWhereUniqueWithoutUserInput | LoginSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LoginSessionUpdateManyWithWhereWithoutUserInput | LoginSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LoginSessionScalarWhereInput | LoginSessionScalarWhereInput[]
  }

  export type UserHospitalAccessUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserHospitalAccessCreateWithoutUserInput, UserHospitalAccessUncheckedCreateWithoutUserInput> | UserHospitalAccessCreateWithoutUserInput[] | UserHospitalAccessUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserHospitalAccessCreateOrConnectWithoutUserInput | UserHospitalAccessCreateOrConnectWithoutUserInput[]
    upsert?: UserHospitalAccessUpsertWithWhereUniqueWithoutUserInput | UserHospitalAccessUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserHospitalAccessCreateManyUserInputEnvelope
    set?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    disconnect?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    delete?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    connect?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    update?: UserHospitalAccessUpdateWithWhereUniqueWithoutUserInput | UserHospitalAccessUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserHospitalAccessUpdateManyWithWhereWithoutUserInput | UserHospitalAccessUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserHospitalAccessScalarWhereInput | UserHospitalAccessScalarWhereInput[]
  }

  export type HospitalCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<HospitalCreateWithoutOrganizationInput, HospitalUncheckedCreateWithoutOrganizationInput> | HospitalCreateWithoutOrganizationInput[] | HospitalUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: HospitalCreateOrConnectWithoutOrganizationInput | HospitalCreateOrConnectWithoutOrganizationInput[]
    createMany?: HospitalCreateManyOrganizationInputEnvelope
    connect?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
  }

  export type UserCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type HospitalUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<HospitalCreateWithoutOrganizationInput, HospitalUncheckedCreateWithoutOrganizationInput> | HospitalCreateWithoutOrganizationInput[] | HospitalUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: HospitalCreateOrConnectWithoutOrganizationInput | HospitalCreateOrConnectWithoutOrganizationInput[]
    createMany?: HospitalCreateManyOrganizationInputEnvelope
    connect?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutOrganizationInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type NullableEnumOrganizationTypeFieldUpdateOperationsInput = {
    set?: $Enums.OrganizationType | null
  }

  export type EnumHospital_Org_statusFieldUpdateOperationsInput = {
    set?: $Enums.Hospital_Org_status
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type HospitalUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<HospitalCreateWithoutOrganizationInput, HospitalUncheckedCreateWithoutOrganizationInput> | HospitalCreateWithoutOrganizationInput[] | HospitalUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: HospitalCreateOrConnectWithoutOrganizationInput | HospitalCreateOrConnectWithoutOrganizationInput[]
    upsert?: HospitalUpsertWithWhereUniqueWithoutOrganizationInput | HospitalUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: HospitalCreateManyOrganizationInputEnvelope
    set?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
    disconnect?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
    delete?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
    connect?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
    update?: HospitalUpdateWithWhereUniqueWithoutOrganizationInput | HospitalUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: HospitalUpdateManyWithWhereWithoutOrganizationInput | HospitalUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: HospitalScalarWhereInput | HospitalScalarWhereInput[]
  }

  export type UserUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutOrganizationInput | UserUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutOrganizationInput | UserUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: UserUpdateManyWithWhereWithoutOrganizationInput | UserUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type HospitalUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<HospitalCreateWithoutOrganizationInput, HospitalUncheckedCreateWithoutOrganizationInput> | HospitalCreateWithoutOrganizationInput[] | HospitalUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: HospitalCreateOrConnectWithoutOrganizationInput | HospitalCreateOrConnectWithoutOrganizationInput[]
    upsert?: HospitalUpsertWithWhereUniqueWithoutOrganizationInput | HospitalUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: HospitalCreateManyOrganizationInputEnvelope
    set?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
    disconnect?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
    delete?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
    connect?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
    update?: HospitalUpdateWithWhereUniqueWithoutOrganizationInput | HospitalUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: HospitalUpdateManyWithWhereWithoutOrganizationInput | HospitalUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: HospitalScalarWhereInput | HospitalScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutOrganizationNestedInput = {
    create?: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput> | UserCreateWithoutOrganizationInput[] | UserUncheckedCreateWithoutOrganizationInput[]
    connectOrCreate?: UserCreateOrConnectWithoutOrganizationInput | UserCreateOrConnectWithoutOrganizationInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutOrganizationInput | UserUpsertWithWhereUniqueWithoutOrganizationInput[]
    createMany?: UserCreateManyOrganizationInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutOrganizationInput | UserUpdateWithWhereUniqueWithoutOrganizationInput[]
    updateMany?: UserUpdateManyWithWhereWithoutOrganizationInput | UserUpdateManyWithWhereWithoutOrganizationInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type HospitalCreateNestedOneWithoutChildHospitalInput = {
    create?: XOR<HospitalCreateWithoutChildHospitalInput, HospitalUncheckedCreateWithoutChildHospitalInput>
    connectOrCreate?: HospitalCreateOrConnectWithoutChildHospitalInput
    connect?: HospitalWhereUniqueInput
  }

  export type HospitalCreateNestedManyWithoutParentHospitalInput = {
    create?: XOR<HospitalCreateWithoutParentHospitalInput, HospitalUncheckedCreateWithoutParentHospitalInput> | HospitalCreateWithoutParentHospitalInput[] | HospitalUncheckedCreateWithoutParentHospitalInput[]
    connectOrCreate?: HospitalCreateOrConnectWithoutParentHospitalInput | HospitalCreateOrConnectWithoutParentHospitalInput[]
    createMany?: HospitalCreateManyParentHospitalInputEnvelope
    connect?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
  }

  export type OrganizationCreateNestedOneWithoutHospitalsInput = {
    create?: XOR<OrganizationCreateWithoutHospitalsInput, OrganizationUncheckedCreateWithoutHospitalsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutHospitalsInput
    connect?: OrganizationWhereUniqueInput
  }

  export type UserHospitalAccessCreateNestedManyWithoutHospitalInput = {
    create?: XOR<UserHospitalAccessCreateWithoutHospitalInput, UserHospitalAccessUncheckedCreateWithoutHospitalInput> | UserHospitalAccessCreateWithoutHospitalInput[] | UserHospitalAccessUncheckedCreateWithoutHospitalInput[]
    connectOrCreate?: UserHospitalAccessCreateOrConnectWithoutHospitalInput | UserHospitalAccessCreateOrConnectWithoutHospitalInput[]
    createMany?: UserHospitalAccessCreateManyHospitalInputEnvelope
    connect?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
  }

  export type HospitalUncheckedCreateNestedManyWithoutParentHospitalInput = {
    create?: XOR<HospitalCreateWithoutParentHospitalInput, HospitalUncheckedCreateWithoutParentHospitalInput> | HospitalCreateWithoutParentHospitalInput[] | HospitalUncheckedCreateWithoutParentHospitalInput[]
    connectOrCreate?: HospitalCreateOrConnectWithoutParentHospitalInput | HospitalCreateOrConnectWithoutParentHospitalInput[]
    createMany?: HospitalCreateManyParentHospitalInputEnvelope
    connect?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
  }

  export type UserHospitalAccessUncheckedCreateNestedManyWithoutHospitalInput = {
    create?: XOR<UserHospitalAccessCreateWithoutHospitalInput, UserHospitalAccessUncheckedCreateWithoutHospitalInput> | UserHospitalAccessCreateWithoutHospitalInput[] | UserHospitalAccessUncheckedCreateWithoutHospitalInput[]
    connectOrCreate?: UserHospitalAccessCreateOrConnectWithoutHospitalInput | UserHospitalAccessCreateOrConnectWithoutHospitalInput[]
    createMany?: UserHospitalAccessCreateManyHospitalInputEnvelope
    connect?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
  }

  export type EnumSpecializationTypeFieldUpdateOperationsInput = {
    set?: $Enums.SpecializationType
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumHospitalLevelFieldUpdateOperationsInput = {
    set?: $Enums.HospitalLevel
  }

  export type HospitalUpdateOneWithoutChildHospitalNestedInput = {
    create?: XOR<HospitalCreateWithoutChildHospitalInput, HospitalUncheckedCreateWithoutChildHospitalInput>
    connectOrCreate?: HospitalCreateOrConnectWithoutChildHospitalInput
    upsert?: HospitalUpsertWithoutChildHospitalInput
    disconnect?: HospitalWhereInput | boolean
    delete?: HospitalWhereInput | boolean
    connect?: HospitalWhereUniqueInput
    update?: XOR<XOR<HospitalUpdateToOneWithWhereWithoutChildHospitalInput, HospitalUpdateWithoutChildHospitalInput>, HospitalUncheckedUpdateWithoutChildHospitalInput>
  }

  export type HospitalUpdateManyWithoutParentHospitalNestedInput = {
    create?: XOR<HospitalCreateWithoutParentHospitalInput, HospitalUncheckedCreateWithoutParentHospitalInput> | HospitalCreateWithoutParentHospitalInput[] | HospitalUncheckedCreateWithoutParentHospitalInput[]
    connectOrCreate?: HospitalCreateOrConnectWithoutParentHospitalInput | HospitalCreateOrConnectWithoutParentHospitalInput[]
    upsert?: HospitalUpsertWithWhereUniqueWithoutParentHospitalInput | HospitalUpsertWithWhereUniqueWithoutParentHospitalInput[]
    createMany?: HospitalCreateManyParentHospitalInputEnvelope
    set?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
    disconnect?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
    delete?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
    connect?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
    update?: HospitalUpdateWithWhereUniqueWithoutParentHospitalInput | HospitalUpdateWithWhereUniqueWithoutParentHospitalInput[]
    updateMany?: HospitalUpdateManyWithWhereWithoutParentHospitalInput | HospitalUpdateManyWithWhereWithoutParentHospitalInput[]
    deleteMany?: HospitalScalarWhereInput | HospitalScalarWhereInput[]
  }

  export type OrganizationUpdateOneRequiredWithoutHospitalsNestedInput = {
    create?: XOR<OrganizationCreateWithoutHospitalsInput, OrganizationUncheckedCreateWithoutHospitalsInput>
    connectOrCreate?: OrganizationCreateOrConnectWithoutHospitalsInput
    upsert?: OrganizationUpsertWithoutHospitalsInput
    connect?: OrganizationWhereUniqueInput
    update?: XOR<XOR<OrganizationUpdateToOneWithWhereWithoutHospitalsInput, OrganizationUpdateWithoutHospitalsInput>, OrganizationUncheckedUpdateWithoutHospitalsInput>
  }

  export type UserHospitalAccessUpdateManyWithoutHospitalNestedInput = {
    create?: XOR<UserHospitalAccessCreateWithoutHospitalInput, UserHospitalAccessUncheckedCreateWithoutHospitalInput> | UserHospitalAccessCreateWithoutHospitalInput[] | UserHospitalAccessUncheckedCreateWithoutHospitalInput[]
    connectOrCreate?: UserHospitalAccessCreateOrConnectWithoutHospitalInput | UserHospitalAccessCreateOrConnectWithoutHospitalInput[]
    upsert?: UserHospitalAccessUpsertWithWhereUniqueWithoutHospitalInput | UserHospitalAccessUpsertWithWhereUniqueWithoutHospitalInput[]
    createMany?: UserHospitalAccessCreateManyHospitalInputEnvelope
    set?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    disconnect?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    delete?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    connect?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    update?: UserHospitalAccessUpdateWithWhereUniqueWithoutHospitalInput | UserHospitalAccessUpdateWithWhereUniqueWithoutHospitalInput[]
    updateMany?: UserHospitalAccessUpdateManyWithWhereWithoutHospitalInput | UserHospitalAccessUpdateManyWithWhereWithoutHospitalInput[]
    deleteMany?: UserHospitalAccessScalarWhereInput | UserHospitalAccessScalarWhereInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type HospitalUncheckedUpdateManyWithoutParentHospitalNestedInput = {
    create?: XOR<HospitalCreateWithoutParentHospitalInput, HospitalUncheckedCreateWithoutParentHospitalInput> | HospitalCreateWithoutParentHospitalInput[] | HospitalUncheckedCreateWithoutParentHospitalInput[]
    connectOrCreate?: HospitalCreateOrConnectWithoutParentHospitalInput | HospitalCreateOrConnectWithoutParentHospitalInput[]
    upsert?: HospitalUpsertWithWhereUniqueWithoutParentHospitalInput | HospitalUpsertWithWhereUniqueWithoutParentHospitalInput[]
    createMany?: HospitalCreateManyParentHospitalInputEnvelope
    set?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
    disconnect?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
    delete?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
    connect?: HospitalWhereUniqueInput | HospitalWhereUniqueInput[]
    update?: HospitalUpdateWithWhereUniqueWithoutParentHospitalInput | HospitalUpdateWithWhereUniqueWithoutParentHospitalInput[]
    updateMany?: HospitalUpdateManyWithWhereWithoutParentHospitalInput | HospitalUpdateManyWithWhereWithoutParentHospitalInput[]
    deleteMany?: HospitalScalarWhereInput | HospitalScalarWhereInput[]
  }

  export type UserHospitalAccessUncheckedUpdateManyWithoutHospitalNestedInput = {
    create?: XOR<UserHospitalAccessCreateWithoutHospitalInput, UserHospitalAccessUncheckedCreateWithoutHospitalInput> | UserHospitalAccessCreateWithoutHospitalInput[] | UserHospitalAccessUncheckedCreateWithoutHospitalInput[]
    connectOrCreate?: UserHospitalAccessCreateOrConnectWithoutHospitalInput | UserHospitalAccessCreateOrConnectWithoutHospitalInput[]
    upsert?: UserHospitalAccessUpsertWithWhereUniqueWithoutHospitalInput | UserHospitalAccessUpsertWithWhereUniqueWithoutHospitalInput[]
    createMany?: UserHospitalAccessCreateManyHospitalInputEnvelope
    set?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    disconnect?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    delete?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    connect?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    update?: UserHospitalAccessUpdateWithWhereUniqueWithoutHospitalInput | UserHospitalAccessUpdateWithWhereUniqueWithoutHospitalInput[]
    updateMany?: UserHospitalAccessUpdateManyWithWhereWithoutHospitalInput | UserHospitalAccessUpdateManyWithWhereWithoutHospitalInput[]
    deleteMany?: UserHospitalAccessScalarWhereInput | UserHospitalAccessScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAdminAccessInput = {
    create?: XOR<UserCreateWithoutAdminAccessInput, UserUncheckedCreateWithoutAdminAccessInput>
    connectOrCreate?: UserCreateOrConnectWithoutAdminAccessInput
    connect?: UserWhereUniqueInput
  }

  export type HospitalCreateNestedOneWithoutUsersInput = {
    create?: XOR<HospitalCreateWithoutUsersInput, HospitalUncheckedCreateWithoutUsersInput>
    connectOrCreate?: HospitalCreateOrConnectWithoutUsersInput
    connect?: HospitalWhereUniqueInput
  }

  export type RoleCreateNestedOneWithoutUserHospitalAccessInput = {
    create?: XOR<RoleCreateWithoutUserHospitalAccessInput, RoleUncheckedCreateWithoutUserHospitalAccessInput>
    connectOrCreate?: RoleCreateOrConnectWithoutUserHospitalAccessInput
    connect?: RoleWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAdminAccessNestedInput = {
    create?: XOR<UserCreateWithoutAdminAccessInput, UserUncheckedCreateWithoutAdminAccessInput>
    connectOrCreate?: UserCreateOrConnectWithoutAdminAccessInput
    upsert?: UserUpsertWithoutAdminAccessInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAdminAccessInput, UserUpdateWithoutAdminAccessInput>, UserUncheckedUpdateWithoutAdminAccessInput>
  }

  export type HospitalUpdateOneRequiredWithoutUsersNestedInput = {
    create?: XOR<HospitalCreateWithoutUsersInput, HospitalUncheckedCreateWithoutUsersInput>
    connectOrCreate?: HospitalCreateOrConnectWithoutUsersInput
    upsert?: HospitalUpsertWithoutUsersInput
    connect?: HospitalWhereUniqueInput
    update?: XOR<XOR<HospitalUpdateToOneWithWhereWithoutUsersInput, HospitalUpdateWithoutUsersInput>, HospitalUncheckedUpdateWithoutUsersInput>
  }

  export type RoleUpdateOneRequiredWithoutUserHospitalAccessNestedInput = {
    create?: XOR<RoleCreateWithoutUserHospitalAccessInput, RoleUncheckedCreateWithoutUserHospitalAccessInput>
    connectOrCreate?: RoleCreateOrConnectWithoutUserHospitalAccessInput
    upsert?: RoleUpsertWithoutUserHospitalAccessInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutUserHospitalAccessInput, RoleUpdateWithoutUserHospitalAccessInput>, RoleUncheckedUpdateWithoutUserHospitalAccessInput>
  }

  export type UserCreateNestedOneWithoutSettingsInput = {
    create?: XOR<UserCreateWithoutSettingsInput, UserUncheckedCreateWithoutSettingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSettingsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutSettingsNestedInput = {
    create?: XOR<UserCreateWithoutSettingsInput, UserUncheckedCreateWithoutSettingsInput>
    connectOrCreate?: UserCreateOrConnectWithoutSettingsInput
    upsert?: UserUpsertWithoutSettingsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutSettingsInput, UserUpdateWithoutSettingsInput>, UserUncheckedUpdateWithoutSettingsInput>
  }

  export type UserCreateNestedOneWithoutAuditLogsInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneWithoutAuditLogsNestedInput = {
    create?: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    connectOrCreate?: UserCreateOrConnectWithoutAuditLogsInput
    upsert?: UserUpsertWithoutAuditLogsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAuditLogsInput, UserUpdateWithoutAuditLogsInput>, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserCreateNestedOneWithoutLoginSessionsInput = {
    create?: XOR<UserCreateWithoutLoginSessionsInput, UserUncheckedCreateWithoutLoginSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLoginSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutLoginSessionsNestedInput = {
    create?: XOR<UserCreateWithoutLoginSessionsInput, UserUncheckedCreateWithoutLoginSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLoginSessionsInput
    upsert?: UserUpsertWithoutLoginSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLoginSessionsInput, UserUpdateWithoutLoginSessionsInput>, UserUncheckedUpdateWithoutLoginSessionsInput>
  }

  export type UserCreateNestedManyWithoutRoleInput = {
    create?: XOR<UserCreateWithoutRoleInput, UserUncheckedCreateWithoutRoleInput> | UserCreateWithoutRoleInput[] | UserUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserCreateOrConnectWithoutRoleInput | UserCreateOrConnectWithoutRoleInput[]
    createMany?: UserCreateManyRoleInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserHospitalAccessCreateNestedManyWithoutRoleInput = {
    create?: XOR<UserHospitalAccessCreateWithoutRoleInput, UserHospitalAccessUncheckedCreateWithoutRoleInput> | UserHospitalAccessCreateWithoutRoleInput[] | UserHospitalAccessUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserHospitalAccessCreateOrConnectWithoutRoleInput | UserHospitalAccessCreateOrConnectWithoutRoleInput[]
    createMany?: UserHospitalAccessCreateManyRoleInputEnvelope
    connect?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
  }

  export type RolePermissionCreateNestedManyWithoutRoleInput = {
    create?: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput> | RolePermissionCreateWithoutRoleInput[] | RolePermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutRoleInput | RolePermissionCreateOrConnectWithoutRoleInput[]
    createMany?: RolePermissionCreateManyRoleInputEnvelope
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<UserCreateWithoutRoleInput, UserUncheckedCreateWithoutRoleInput> | UserCreateWithoutRoleInput[] | UserUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserCreateOrConnectWithoutRoleInput | UserCreateOrConnectWithoutRoleInput[]
    createMany?: UserCreateManyRoleInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserHospitalAccessUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<UserHospitalAccessCreateWithoutRoleInput, UserHospitalAccessUncheckedCreateWithoutRoleInput> | UserHospitalAccessCreateWithoutRoleInput[] | UserHospitalAccessUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserHospitalAccessCreateOrConnectWithoutRoleInput | UserHospitalAccessCreateOrConnectWithoutRoleInput[]
    createMany?: UserHospitalAccessCreateManyRoleInputEnvelope
    connect?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
  }

  export type RolePermissionUncheckedCreateNestedManyWithoutRoleInput = {
    create?: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput> | RolePermissionCreateWithoutRoleInput[] | RolePermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutRoleInput | RolePermissionCreateOrConnectWithoutRoleInput[]
    createMany?: RolePermissionCreateManyRoleInputEnvelope
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutRoleNestedInput = {
    create?: XOR<UserCreateWithoutRoleInput, UserUncheckedCreateWithoutRoleInput> | UserCreateWithoutRoleInput[] | UserUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserCreateOrConnectWithoutRoleInput | UserCreateOrConnectWithoutRoleInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutRoleInput | UserUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: UserCreateManyRoleInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutRoleInput | UserUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: UserUpdateManyWithWhereWithoutRoleInput | UserUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserHospitalAccessUpdateManyWithoutRoleNestedInput = {
    create?: XOR<UserHospitalAccessCreateWithoutRoleInput, UserHospitalAccessUncheckedCreateWithoutRoleInput> | UserHospitalAccessCreateWithoutRoleInput[] | UserHospitalAccessUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserHospitalAccessCreateOrConnectWithoutRoleInput | UserHospitalAccessCreateOrConnectWithoutRoleInput[]
    upsert?: UserHospitalAccessUpsertWithWhereUniqueWithoutRoleInput | UserHospitalAccessUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: UserHospitalAccessCreateManyRoleInputEnvelope
    set?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    disconnect?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    delete?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    connect?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    update?: UserHospitalAccessUpdateWithWhereUniqueWithoutRoleInput | UserHospitalAccessUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: UserHospitalAccessUpdateManyWithWhereWithoutRoleInput | UserHospitalAccessUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: UserHospitalAccessScalarWhereInput | UserHospitalAccessScalarWhereInput[]
  }

  export type RolePermissionUpdateManyWithoutRoleNestedInput = {
    create?: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput> | RolePermissionCreateWithoutRoleInput[] | RolePermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutRoleInput | RolePermissionCreateOrConnectWithoutRoleInput[]
    upsert?: RolePermissionUpsertWithWhereUniqueWithoutRoleInput | RolePermissionUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: RolePermissionCreateManyRoleInputEnvelope
    set?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    disconnect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    delete?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    update?: RolePermissionUpdateWithWhereUniqueWithoutRoleInput | RolePermissionUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: RolePermissionUpdateManyWithWhereWithoutRoleInput | RolePermissionUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<UserCreateWithoutRoleInput, UserUncheckedCreateWithoutRoleInput> | UserCreateWithoutRoleInput[] | UserUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserCreateOrConnectWithoutRoleInput | UserCreateOrConnectWithoutRoleInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutRoleInput | UserUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: UserCreateManyRoleInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutRoleInput | UserUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: UserUpdateManyWithWhereWithoutRoleInput | UserUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserHospitalAccessUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<UserHospitalAccessCreateWithoutRoleInput, UserHospitalAccessUncheckedCreateWithoutRoleInput> | UserHospitalAccessCreateWithoutRoleInput[] | UserHospitalAccessUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: UserHospitalAccessCreateOrConnectWithoutRoleInput | UserHospitalAccessCreateOrConnectWithoutRoleInput[]
    upsert?: UserHospitalAccessUpsertWithWhereUniqueWithoutRoleInput | UserHospitalAccessUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: UserHospitalAccessCreateManyRoleInputEnvelope
    set?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    disconnect?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    delete?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    connect?: UserHospitalAccessWhereUniqueInput | UserHospitalAccessWhereUniqueInput[]
    update?: UserHospitalAccessUpdateWithWhereUniqueWithoutRoleInput | UserHospitalAccessUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: UserHospitalAccessUpdateManyWithWhereWithoutRoleInput | UserHospitalAccessUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: UserHospitalAccessScalarWhereInput | UserHospitalAccessScalarWhereInput[]
  }

  export type RolePermissionUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput> | RolePermissionCreateWithoutRoleInput[] | RolePermissionUncheckedCreateWithoutRoleInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutRoleInput | RolePermissionCreateOrConnectWithoutRoleInput[]
    upsert?: RolePermissionUpsertWithWhereUniqueWithoutRoleInput | RolePermissionUpsertWithWhereUniqueWithoutRoleInput[]
    createMany?: RolePermissionCreateManyRoleInputEnvelope
    set?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    disconnect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    delete?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    update?: RolePermissionUpdateWithWhereUniqueWithoutRoleInput | RolePermissionUpdateWithWhereUniqueWithoutRoleInput[]
    updateMany?: RolePermissionUpdateManyWithWhereWithoutRoleInput | RolePermissionUpdateManyWithWhereWithoutRoleInput[]
    deleteMany?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
  }

  export type RoleCreateNestedOneWithoutPermissionsInput = {
    create?: XOR<RoleCreateWithoutPermissionsInput, RoleUncheckedCreateWithoutPermissionsInput>
    connectOrCreate?: RoleCreateOrConnectWithoutPermissionsInput
    connect?: RoleWhereUniqueInput
  }

  export type PermissionCreateNestedOneWithoutRolesInput = {
    create?: XOR<PermissionCreateWithoutRolesInput, PermissionUncheckedCreateWithoutRolesInput>
    connectOrCreate?: PermissionCreateOrConnectWithoutRolesInput
    connect?: PermissionWhereUniqueInput
  }

  export type RoleUpdateOneRequiredWithoutPermissionsNestedInput = {
    create?: XOR<RoleCreateWithoutPermissionsInput, RoleUncheckedCreateWithoutPermissionsInput>
    connectOrCreate?: RoleCreateOrConnectWithoutPermissionsInput
    upsert?: RoleUpsertWithoutPermissionsInput
    connect?: RoleWhereUniqueInput
    update?: XOR<XOR<RoleUpdateToOneWithWhereWithoutPermissionsInput, RoleUpdateWithoutPermissionsInput>, RoleUncheckedUpdateWithoutPermissionsInput>
  }

  export type PermissionUpdateOneRequiredWithoutRolesNestedInput = {
    create?: XOR<PermissionCreateWithoutRolesInput, PermissionUncheckedCreateWithoutRolesInput>
    connectOrCreate?: PermissionCreateOrConnectWithoutRolesInput
    upsert?: PermissionUpsertWithoutRolesInput
    connect?: PermissionWhereUniqueInput
    update?: XOR<XOR<PermissionUpdateToOneWithWhereWithoutRolesInput, PermissionUpdateWithoutRolesInput>, PermissionUncheckedUpdateWithoutRolesInput>
  }

  export type RolePermissionCreateNestedManyWithoutPermissionInput = {
    create?: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput> | RolePermissionCreateWithoutPermissionInput[] | RolePermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutPermissionInput | RolePermissionCreateOrConnectWithoutPermissionInput[]
    createMany?: RolePermissionCreateManyPermissionInputEnvelope
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
  }

  export type RolePermissionUncheckedCreateNestedManyWithoutPermissionInput = {
    create?: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput> | RolePermissionCreateWithoutPermissionInput[] | RolePermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutPermissionInput | RolePermissionCreateOrConnectWithoutPermissionInput[]
    createMany?: RolePermissionCreateManyPermissionInputEnvelope
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
  }

  export type RolePermissionUpdateManyWithoutPermissionNestedInput = {
    create?: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput> | RolePermissionCreateWithoutPermissionInput[] | RolePermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutPermissionInput | RolePermissionCreateOrConnectWithoutPermissionInput[]
    upsert?: RolePermissionUpsertWithWhereUniqueWithoutPermissionInput | RolePermissionUpsertWithWhereUniqueWithoutPermissionInput[]
    createMany?: RolePermissionCreateManyPermissionInputEnvelope
    set?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    disconnect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    delete?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    update?: RolePermissionUpdateWithWhereUniqueWithoutPermissionInput | RolePermissionUpdateWithWhereUniqueWithoutPermissionInput[]
    updateMany?: RolePermissionUpdateManyWithWhereWithoutPermissionInput | RolePermissionUpdateManyWithWhereWithoutPermissionInput[]
    deleteMany?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
  }

  export type RolePermissionUncheckedUpdateManyWithoutPermissionNestedInput = {
    create?: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput> | RolePermissionCreateWithoutPermissionInput[] | RolePermissionUncheckedCreateWithoutPermissionInput[]
    connectOrCreate?: RolePermissionCreateOrConnectWithoutPermissionInput | RolePermissionCreateOrConnectWithoutPermissionInput[]
    upsert?: RolePermissionUpsertWithWhereUniqueWithoutPermissionInput | RolePermissionUpsertWithWhereUniqueWithoutPermissionInput[]
    createMany?: RolePermissionCreateManyPermissionInputEnvelope
    set?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    disconnect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    delete?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    connect?: RolePermissionWhereUniqueInput | RolePermissionWhereUniqueInput[]
    update?: RolePermissionUpdateWithWhereUniqueWithoutPermissionInput | RolePermissionUpdateWithWhereUniqueWithoutPermissionInput[]
    updateMany?: RolePermissionUpdateManyWithWhereWithoutPermissionInput | RolePermissionUpdateManyWithWhereWithoutPermissionInput[]
    deleteMany?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumTitleFilter<$PrismaModel = never> = {
    equals?: $Enums.Title | EnumTitleFieldRefInput<$PrismaModel>
    in?: $Enums.Title[] | ListEnumTitleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Title[] | ListEnumTitleFieldRefInput<$PrismaModel>
    not?: NestedEnumTitleFilter<$PrismaModel> | $Enums.Title
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedEnumTitleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Title | EnumTitleFieldRefInput<$PrismaModel>
    in?: $Enums.Title[] | ListEnumTitleFieldRefInput<$PrismaModel>
    notIn?: $Enums.Title[] | ListEnumTitleFieldRefInput<$PrismaModel>
    not?: NestedEnumTitleWithAggregatesFilter<$PrismaModel> | $Enums.Title
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTitleFilter<$PrismaModel>
    _max?: NestedEnumTitleFilter<$PrismaModel>
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumOrganizationTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.OrganizationType | EnumOrganizationTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.OrganizationType[] | ListEnumOrganizationTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.OrganizationType[] | ListEnumOrganizationTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumOrganizationTypeNullableFilter<$PrismaModel> | $Enums.OrganizationType | null
  }

  export type NestedEnumHospital_Org_statusFilter<$PrismaModel = never> = {
    equals?: $Enums.Hospital_Org_status | EnumHospital_Org_statusFieldRefInput<$PrismaModel>
    in?: $Enums.Hospital_Org_status[] | ListEnumHospital_Org_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Hospital_Org_status[] | ListEnumHospital_Org_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumHospital_Org_statusFilter<$PrismaModel> | $Enums.Hospital_Org_status
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumOrganizationTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrganizationType | EnumOrganizationTypeFieldRefInput<$PrismaModel> | null
    in?: $Enums.OrganizationType[] | ListEnumOrganizationTypeFieldRefInput<$PrismaModel> | null
    notIn?: $Enums.OrganizationType[] | ListEnumOrganizationTypeFieldRefInput<$PrismaModel> | null
    not?: NestedEnumOrganizationTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.OrganizationType | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedEnumOrganizationTypeNullableFilter<$PrismaModel>
    _max?: NestedEnumOrganizationTypeNullableFilter<$PrismaModel>
  }

  export type NestedEnumHospital_Org_statusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Hospital_Org_status | EnumHospital_Org_statusFieldRefInput<$PrismaModel>
    in?: $Enums.Hospital_Org_status[] | ListEnumHospital_Org_statusFieldRefInput<$PrismaModel>
    notIn?: $Enums.Hospital_Org_status[] | ListEnumHospital_Org_statusFieldRefInput<$PrismaModel>
    not?: NestedEnumHospital_Org_statusWithAggregatesFilter<$PrismaModel> | $Enums.Hospital_Org_status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumHospital_Org_statusFilter<$PrismaModel>
    _max?: NestedEnumHospital_Org_statusFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumSpecializationTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.SpecializationType | EnumSpecializationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SpecializationType[] | ListEnumSpecializationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SpecializationType[] | ListEnumSpecializationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSpecializationTypeFilter<$PrismaModel> | $Enums.SpecializationType
  }

  export type NestedEnumHospitalLevelFilter<$PrismaModel = never> = {
    equals?: $Enums.HospitalLevel | EnumHospitalLevelFieldRefInput<$PrismaModel>
    in?: $Enums.HospitalLevel[] | ListEnumHospitalLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.HospitalLevel[] | ListEnumHospitalLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumHospitalLevelFilter<$PrismaModel> | $Enums.HospitalLevel
  }

  export type NestedEnumSpecializationTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SpecializationType | EnumSpecializationTypeFieldRefInput<$PrismaModel>
    in?: $Enums.SpecializationType[] | ListEnumSpecializationTypeFieldRefInput<$PrismaModel>
    notIn?: $Enums.SpecializationType[] | ListEnumSpecializationTypeFieldRefInput<$PrismaModel>
    not?: NestedEnumSpecializationTypeWithAggregatesFilter<$PrismaModel> | $Enums.SpecializationType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSpecializationTypeFilter<$PrismaModel>
    _max?: NestedEnumSpecializationTypeFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedEnumHospitalLevelWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HospitalLevel | EnumHospitalLevelFieldRefInput<$PrismaModel>
    in?: $Enums.HospitalLevel[] | ListEnumHospitalLevelFieldRefInput<$PrismaModel>
    notIn?: $Enums.HospitalLevel[] | ListEnumHospitalLevelFieldRefInput<$PrismaModel>
    not?: NestedEnumHospitalLevelWithAggregatesFilter<$PrismaModel> | $Enums.HospitalLevel
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumHospitalLevelFilter<$PrismaModel>
    _max?: NestedEnumHospitalLevelFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type RoleCreateWithoutUsersInput = {
    Rolename: string
    description: string
    isActive?: boolean
    UserHospitalAccess?: UserHospitalAccessCreateNestedManyWithoutRoleInput
    permissions?: RolePermissionCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateWithoutUsersInput = {
    id?: number
    Rolename: string
    description: string
    isActive?: boolean
    UserHospitalAccess?: UserHospitalAccessUncheckedCreateNestedManyWithoutRoleInput
    permissions?: RolePermissionUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleCreateOrConnectWithoutUsersInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
  }

  export type OrganizationCreateWithoutUsersInput = {
    OrganizationName: string
    Organizationcode: string
    logoUrl: string
    email: string
    contactNumber: string
    Orgnizationtype?: $Enums.OrganizationType | null
    website: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    country: string
    postalCode: string
    registrationNo: string
    establishedOn: Date | string
    industryType: string
    status?: $Enums.Hospital_Org_status
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    hospitals?: HospitalCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutUsersInput = {
    id?: number
    OrganizationName: string
    Organizationcode: string
    logoUrl: string
    email: string
    contactNumber: string
    Orgnizationtype?: $Enums.OrganizationType | null
    website: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    country: string
    postalCode: string
    registrationNo: string
    establishedOn: Date | string
    industryType: string
    status?: $Enums.Hospital_Org_status
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    hospitals?: HospitalUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutUsersInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
  }

  export type SettingCreateWithoutUserInput = {
    theme?: string
    language?: string
  }

  export type SettingUncheckedCreateWithoutUserInput = {
    id?: number
    theme?: string
    language?: string
  }

  export type SettingCreateOrConnectWithoutUserInput = {
    where: SettingWhereUniqueInput
    create: XOR<SettingCreateWithoutUserInput, SettingUncheckedCreateWithoutUserInput>
  }

  export type AuditLogCreateWithoutUserInput = {
    action: string
    entity: string
    entityId?: number | null
    timestamp?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogUncheckedCreateWithoutUserInput = {
    id?: number
    action: string
    entity: string
    entityId?: number | null
    timestamp?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogCreateOrConnectWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogCreateManyUserInputEnvelope = {
    data: AuditLogCreateManyUserInput | AuditLogCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type LoginSessionCreateWithoutUserInput = {
    ipAddress: string
    userAgent: string
    loginAt?: Date | string
  }

  export type LoginSessionUncheckedCreateWithoutUserInput = {
    id?: number
    ipAddress: string
    userAgent: string
    loginAt?: Date | string
  }

  export type LoginSessionCreateOrConnectWithoutUserInput = {
    where: LoginSessionWhereUniqueInput
    create: XOR<LoginSessionCreateWithoutUserInput, LoginSessionUncheckedCreateWithoutUserInput>
  }

  export type LoginSessionCreateManyUserInputEnvelope = {
    data: LoginSessionCreateManyUserInput | LoginSessionCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type UserHospitalAccessCreateWithoutUserInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    hospital: HospitalCreateNestedOneWithoutUsersInput
    role: RoleCreateNestedOneWithoutUserHospitalAccessInput
  }

  export type UserHospitalAccessUncheckedCreateWithoutUserInput = {
    id?: number
    hospitalId: number
    roleId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserHospitalAccessCreateOrConnectWithoutUserInput = {
    where: UserHospitalAccessWhereUniqueInput
    create: XOR<UserHospitalAccessCreateWithoutUserInput, UserHospitalAccessUncheckedCreateWithoutUserInput>
  }

  export type UserHospitalAccessCreateManyUserInputEnvelope = {
    data: UserHospitalAccessCreateManyUserInput | UserHospitalAccessCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type RoleUpsertWithoutUsersInput = {
    update: XOR<RoleUpdateWithoutUsersInput, RoleUncheckedUpdateWithoutUsersInput>
    create: XOR<RoleCreateWithoutUsersInput, RoleUncheckedCreateWithoutUsersInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutUsersInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutUsersInput, RoleUncheckedUpdateWithoutUsersInput>
  }

  export type RoleUpdateWithoutUsersInput = {
    Rolename?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    UserHospitalAccess?: UserHospitalAccessUpdateManyWithoutRoleNestedInput
    permissions?: RolePermissionUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    Rolename?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    UserHospitalAccess?: UserHospitalAccessUncheckedUpdateManyWithoutRoleNestedInput
    permissions?: RolePermissionUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type OrganizationUpsertWithoutUsersInput = {
    update: XOR<OrganizationUpdateWithoutUsersInput, OrganizationUncheckedUpdateWithoutUsersInput>
    create: XOR<OrganizationCreateWithoutUsersInput, OrganizationUncheckedCreateWithoutUsersInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutUsersInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutUsersInput, OrganizationUncheckedUpdateWithoutUsersInput>
  }

  export type OrganizationUpdateWithoutUsersInput = {
    OrganizationName?: StringFieldUpdateOperationsInput | string
    Organizationcode?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    Orgnizationtype?: NullableEnumOrganizationTypeFieldUpdateOperationsInput | $Enums.OrganizationType | null
    website?: StringFieldUpdateOperationsInput | string
    addressLine1?: StringFieldUpdateOperationsInput | string
    addressLine2?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    establishedOn?: DateTimeFieldUpdateOperationsInput | Date | string
    industryType?: StringFieldUpdateOperationsInput | string
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hospitals?: HospitalUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    OrganizationName?: StringFieldUpdateOperationsInput | string
    Organizationcode?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    Orgnizationtype?: NullableEnumOrganizationTypeFieldUpdateOperationsInput | $Enums.OrganizationType | null
    website?: StringFieldUpdateOperationsInput | string
    addressLine1?: StringFieldUpdateOperationsInput | string
    addressLine2?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    establishedOn?: DateTimeFieldUpdateOperationsInput | Date | string
    industryType?: StringFieldUpdateOperationsInput | string
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hospitals?: HospitalUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type SettingUpsertWithoutUserInput = {
    update: XOR<SettingUpdateWithoutUserInput, SettingUncheckedUpdateWithoutUserInput>
    create: XOR<SettingCreateWithoutUserInput, SettingUncheckedCreateWithoutUserInput>
    where?: SettingWhereInput
  }

  export type SettingUpdateToOneWithWhereWithoutUserInput = {
    where?: SettingWhereInput
    data: XOR<SettingUpdateWithoutUserInput, SettingUncheckedUpdateWithoutUserInput>
  }

  export type SettingUpdateWithoutUserInput = {
    theme?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
  }

  export type SettingUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    theme?: StringFieldUpdateOperationsInput | string
    language?: StringFieldUpdateOperationsInput | string
  }

  export type AuditLogUpsertWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    update: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
    create: XOR<AuditLogCreateWithoutUserInput, AuditLogUncheckedCreateWithoutUserInput>
  }

  export type AuditLogUpdateWithWhereUniqueWithoutUserInput = {
    where: AuditLogWhereUniqueInput
    data: XOR<AuditLogUpdateWithoutUserInput, AuditLogUncheckedUpdateWithoutUserInput>
  }

  export type AuditLogUpdateManyWithWhereWithoutUserInput = {
    where: AuditLogScalarWhereInput
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyWithoutUserInput>
  }

  export type AuditLogScalarWhereInput = {
    AND?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    OR?: AuditLogScalarWhereInput[]
    NOT?: AuditLogScalarWhereInput | AuditLogScalarWhereInput[]
    id?: IntFilter<"AuditLog"> | number
    userId?: IntNullableFilter<"AuditLog"> | number | null
    action?: StringFilter<"AuditLog"> | string
    entity?: StringFilter<"AuditLog"> | string
    entityId?: IntNullableFilter<"AuditLog"> | number | null
    timestamp?: DateTimeFilter<"AuditLog"> | Date | string
    metadata?: JsonNullableFilter<"AuditLog">
  }

  export type LoginSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: LoginSessionWhereUniqueInput
    update: XOR<LoginSessionUpdateWithoutUserInput, LoginSessionUncheckedUpdateWithoutUserInput>
    create: XOR<LoginSessionCreateWithoutUserInput, LoginSessionUncheckedCreateWithoutUserInput>
  }

  export type LoginSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: LoginSessionWhereUniqueInput
    data: XOR<LoginSessionUpdateWithoutUserInput, LoginSessionUncheckedUpdateWithoutUserInput>
  }

  export type LoginSessionUpdateManyWithWhereWithoutUserInput = {
    where: LoginSessionScalarWhereInput
    data: XOR<LoginSessionUpdateManyMutationInput, LoginSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type LoginSessionScalarWhereInput = {
    AND?: LoginSessionScalarWhereInput | LoginSessionScalarWhereInput[]
    OR?: LoginSessionScalarWhereInput[]
    NOT?: LoginSessionScalarWhereInput | LoginSessionScalarWhereInput[]
    id?: IntFilter<"LoginSession"> | number
    userId?: IntFilter<"LoginSession"> | number
    ipAddress?: StringFilter<"LoginSession"> | string
    userAgent?: StringFilter<"LoginSession"> | string
    loginAt?: DateTimeFilter<"LoginSession"> | Date | string
  }

  export type UserHospitalAccessUpsertWithWhereUniqueWithoutUserInput = {
    where: UserHospitalAccessWhereUniqueInput
    update: XOR<UserHospitalAccessUpdateWithoutUserInput, UserHospitalAccessUncheckedUpdateWithoutUserInput>
    create: XOR<UserHospitalAccessCreateWithoutUserInput, UserHospitalAccessUncheckedCreateWithoutUserInput>
  }

  export type UserHospitalAccessUpdateWithWhereUniqueWithoutUserInput = {
    where: UserHospitalAccessWhereUniqueInput
    data: XOR<UserHospitalAccessUpdateWithoutUserInput, UserHospitalAccessUncheckedUpdateWithoutUserInput>
  }

  export type UserHospitalAccessUpdateManyWithWhereWithoutUserInput = {
    where: UserHospitalAccessScalarWhereInput
    data: XOR<UserHospitalAccessUpdateManyMutationInput, UserHospitalAccessUncheckedUpdateManyWithoutUserInput>
  }

  export type UserHospitalAccessScalarWhereInput = {
    AND?: UserHospitalAccessScalarWhereInput | UserHospitalAccessScalarWhereInput[]
    OR?: UserHospitalAccessScalarWhereInput[]
    NOT?: UserHospitalAccessScalarWhereInput | UserHospitalAccessScalarWhereInput[]
    id?: IntFilter<"UserHospitalAccess"> | number
    userId?: IntFilter<"UserHospitalAccess"> | number
    hospitalId?: IntFilter<"UserHospitalAccess"> | number
    roleId?: IntFilter<"UserHospitalAccess"> | number
    createdAt?: DateTimeFilter<"UserHospitalAccess"> | Date | string
    updatedAt?: DateTimeFilter<"UserHospitalAccess"> | Date | string
  }

  export type HospitalCreateWithoutOrganizationInput = {
    name: string
    hospitalCode: string
    ParentHospitalCode?: string | null
    Organizationcode?: string | null
    SpecializationType: $Enums.SpecializationType
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    contactNumber: string
    email: string
    website: string
    logoUrl: string
    latitude: number
    longitude: number
    status?: $Enums.Hospital_Org_status
    level: $Enums.HospitalLevel
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    parentHospital?: HospitalCreateNestedOneWithoutChildHospitalInput
    childHospital?: HospitalCreateNestedManyWithoutParentHospitalInput
    users?: UserHospitalAccessCreateNestedManyWithoutHospitalInput
  }

  export type HospitalUncheckedCreateWithoutOrganizationInput = {
    id?: number
    name: string
    hospitalCode: string
    ParentHospitalCode?: string | null
    Organizationcode?: string | null
    SpecializationType: $Enums.SpecializationType
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    contactNumber: string
    email: string
    website: string
    logoUrl: string
    latitude: number
    longitude: number
    status?: $Enums.Hospital_Org_status
    level: $Enums.HospitalLevel
    parentHospitalId?: number | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    childHospital?: HospitalUncheckedCreateNestedManyWithoutParentHospitalInput
    users?: UserHospitalAccessUncheckedCreateNestedManyWithoutHospitalInput
  }

  export type HospitalCreateOrConnectWithoutOrganizationInput = {
    where: HospitalWhereUniqueInput
    create: XOR<HospitalCreateWithoutOrganizationInput, HospitalUncheckedCreateWithoutOrganizationInput>
  }

  export type HospitalCreateManyOrganizationInputEnvelope = {
    data: HospitalCreateManyOrganizationInput | HospitalCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type UserCreateWithoutOrganizationInput = {
    title: $Enums.Title
    imageUrl: string
    firstName: string
    lastName: string
    gender: string
    email: string
    mobile: string
    passwordHash: string
    isActive?: boolean
    hashedRefreshToken: string
    dateOfBirth: Date | string
    deletedAt?: Date | string | null
    role: RoleCreateNestedOneWithoutUsersInput
    settings?: SettingCreateNestedOneWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    loginSessions?: LoginSessionCreateNestedManyWithoutUserInput
    AdminAccess?: UserHospitalAccessCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutOrganizationInput = {
    id?: number
    title: $Enums.Title
    imageUrl: string
    firstName: string
    lastName: string
    gender: string
    email: string
    mobile: string
    passwordHash: string
    isActive?: boolean
    hashedRefreshToken: string
    dateOfBirth: Date | string
    roleId: number
    deletedAt?: Date | string | null
    settings?: SettingUncheckedCreateNestedOneWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    loginSessions?: LoginSessionUncheckedCreateNestedManyWithoutUserInput
    AdminAccess?: UserHospitalAccessUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutOrganizationInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput>
  }

  export type UserCreateManyOrganizationInputEnvelope = {
    data: UserCreateManyOrganizationInput | UserCreateManyOrganizationInput[]
    skipDuplicates?: boolean
  }

  export type HospitalUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: HospitalWhereUniqueInput
    update: XOR<HospitalUpdateWithoutOrganizationInput, HospitalUncheckedUpdateWithoutOrganizationInput>
    create: XOR<HospitalCreateWithoutOrganizationInput, HospitalUncheckedCreateWithoutOrganizationInput>
  }

  export type HospitalUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: HospitalWhereUniqueInput
    data: XOR<HospitalUpdateWithoutOrganizationInput, HospitalUncheckedUpdateWithoutOrganizationInput>
  }

  export type HospitalUpdateManyWithWhereWithoutOrganizationInput = {
    where: HospitalScalarWhereInput
    data: XOR<HospitalUpdateManyMutationInput, HospitalUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type HospitalScalarWhereInput = {
    AND?: HospitalScalarWhereInput | HospitalScalarWhereInput[]
    OR?: HospitalScalarWhereInput[]
    NOT?: HospitalScalarWhereInput | HospitalScalarWhereInput[]
    id?: IntFilter<"Hospital"> | number
    name?: StringFilter<"Hospital"> | string
    hospitalCode?: StringFilter<"Hospital"> | string
    ParentHospitalCode?: StringNullableFilter<"Hospital"> | string | null
    Organizationcode?: StringNullableFilter<"Hospital"> | string | null
    SpecializationType?: EnumSpecializationTypeFilter<"Hospital"> | $Enums.SpecializationType
    address?: StringFilter<"Hospital"> | string
    city?: StringFilter<"Hospital"> | string
    state?: StringFilter<"Hospital"> | string
    country?: StringFilter<"Hospital"> | string
    postalCode?: StringFilter<"Hospital"> | string
    contactNumber?: StringFilter<"Hospital"> | string
    email?: StringFilter<"Hospital"> | string
    website?: StringFilter<"Hospital"> | string
    logoUrl?: StringFilter<"Hospital"> | string
    latitude?: FloatFilter<"Hospital"> | number
    longitude?: FloatFilter<"Hospital"> | number
    status?: EnumHospital_Org_statusFilter<"Hospital"> | $Enums.Hospital_Org_status
    level?: EnumHospitalLevelFilter<"Hospital"> | $Enums.HospitalLevel
    parentHospitalId?: IntNullableFilter<"Hospital"> | number | null
    organizationId?: IntFilter<"Hospital"> | number
    isActive?: BoolFilter<"Hospital"> | boolean
    createdAt?: DateTimeFilter<"Hospital"> | Date | string
    updatedAt?: DateTimeFilter<"Hospital"> | Date | string
    deletedAt?: DateTimeNullableFilter<"Hospital"> | Date | string | null
  }

  export type UserUpsertWithWhereUniqueWithoutOrganizationInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutOrganizationInput, UserUncheckedUpdateWithoutOrganizationInput>
    create: XOR<UserCreateWithoutOrganizationInput, UserUncheckedCreateWithoutOrganizationInput>
  }

  export type UserUpdateWithWhereUniqueWithoutOrganizationInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutOrganizationInput, UserUncheckedUpdateWithoutOrganizationInput>
  }

  export type UserUpdateManyWithWhereWithoutOrganizationInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutOrganizationInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: IntFilter<"User"> | number
    title?: EnumTitleFilter<"User"> | $Enums.Title
    imageUrl?: StringFilter<"User"> | string
    firstName?: StringFilter<"User"> | string
    lastName?: StringFilter<"User"> | string
    gender?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    mobile?: StringFilter<"User"> | string
    passwordHash?: StringFilter<"User"> | string
    isActive?: BoolFilter<"User"> | boolean
    hashedRefreshToken?: StringFilter<"User"> | string
    dateOfBirth?: DateTimeFilter<"User"> | Date | string
    roleId?: IntFilter<"User"> | number
    organizationId?: IntFilter<"User"> | number
    deletedAt?: DateTimeNullableFilter<"User"> | Date | string | null
  }

  export type HospitalCreateWithoutChildHospitalInput = {
    name: string
    hospitalCode: string
    ParentHospitalCode?: string | null
    Organizationcode?: string | null
    SpecializationType: $Enums.SpecializationType
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    contactNumber: string
    email: string
    website: string
    logoUrl: string
    latitude: number
    longitude: number
    status?: $Enums.Hospital_Org_status
    level: $Enums.HospitalLevel
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    parentHospital?: HospitalCreateNestedOneWithoutChildHospitalInput
    Organization: OrganizationCreateNestedOneWithoutHospitalsInput
    users?: UserHospitalAccessCreateNestedManyWithoutHospitalInput
  }

  export type HospitalUncheckedCreateWithoutChildHospitalInput = {
    id?: number
    name: string
    hospitalCode: string
    ParentHospitalCode?: string | null
    Organizationcode?: string | null
    SpecializationType: $Enums.SpecializationType
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    contactNumber: string
    email: string
    website: string
    logoUrl: string
    latitude: number
    longitude: number
    status?: $Enums.Hospital_Org_status
    level: $Enums.HospitalLevel
    parentHospitalId?: number | null
    organizationId: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    users?: UserHospitalAccessUncheckedCreateNestedManyWithoutHospitalInput
  }

  export type HospitalCreateOrConnectWithoutChildHospitalInput = {
    where: HospitalWhereUniqueInput
    create: XOR<HospitalCreateWithoutChildHospitalInput, HospitalUncheckedCreateWithoutChildHospitalInput>
  }

  export type HospitalCreateWithoutParentHospitalInput = {
    name: string
    hospitalCode: string
    ParentHospitalCode?: string | null
    Organizationcode?: string | null
    SpecializationType: $Enums.SpecializationType
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    contactNumber: string
    email: string
    website: string
    logoUrl: string
    latitude: number
    longitude: number
    status?: $Enums.Hospital_Org_status
    level: $Enums.HospitalLevel
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    childHospital?: HospitalCreateNestedManyWithoutParentHospitalInput
    Organization: OrganizationCreateNestedOneWithoutHospitalsInput
    users?: UserHospitalAccessCreateNestedManyWithoutHospitalInput
  }

  export type HospitalUncheckedCreateWithoutParentHospitalInput = {
    id?: number
    name: string
    hospitalCode: string
    ParentHospitalCode?: string | null
    Organizationcode?: string | null
    SpecializationType: $Enums.SpecializationType
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    contactNumber: string
    email: string
    website: string
    logoUrl: string
    latitude: number
    longitude: number
    status?: $Enums.Hospital_Org_status
    level: $Enums.HospitalLevel
    organizationId: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    childHospital?: HospitalUncheckedCreateNestedManyWithoutParentHospitalInput
    users?: UserHospitalAccessUncheckedCreateNestedManyWithoutHospitalInput
  }

  export type HospitalCreateOrConnectWithoutParentHospitalInput = {
    where: HospitalWhereUniqueInput
    create: XOR<HospitalCreateWithoutParentHospitalInput, HospitalUncheckedCreateWithoutParentHospitalInput>
  }

  export type HospitalCreateManyParentHospitalInputEnvelope = {
    data: HospitalCreateManyParentHospitalInput | HospitalCreateManyParentHospitalInput[]
    skipDuplicates?: boolean
  }

  export type OrganizationCreateWithoutHospitalsInput = {
    OrganizationName: string
    Organizationcode: string
    logoUrl: string
    email: string
    contactNumber: string
    Orgnizationtype?: $Enums.OrganizationType | null
    website: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    country: string
    postalCode: string
    registrationNo: string
    establishedOn: Date | string
    industryType: string
    status?: $Enums.Hospital_Org_status
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationUncheckedCreateWithoutHospitalsInput = {
    id?: number
    OrganizationName: string
    Organizationcode: string
    logoUrl: string
    email: string
    contactNumber: string
    Orgnizationtype?: $Enums.OrganizationType | null
    website: string
    addressLine1: string
    addressLine2: string
    city: string
    state: string
    country: string
    postalCode: string
    registrationNo: string
    establishedOn: Date | string
    industryType: string
    status?: $Enums.Hospital_Org_status
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutOrganizationInput
  }

  export type OrganizationCreateOrConnectWithoutHospitalsInput = {
    where: OrganizationWhereUniqueInput
    create: XOR<OrganizationCreateWithoutHospitalsInput, OrganizationUncheckedCreateWithoutHospitalsInput>
  }

  export type UserHospitalAccessCreateWithoutHospitalInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAdminAccessInput
    role: RoleCreateNestedOneWithoutUserHospitalAccessInput
  }

  export type UserHospitalAccessUncheckedCreateWithoutHospitalInput = {
    id?: number
    userId: number
    roleId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserHospitalAccessCreateOrConnectWithoutHospitalInput = {
    where: UserHospitalAccessWhereUniqueInput
    create: XOR<UserHospitalAccessCreateWithoutHospitalInput, UserHospitalAccessUncheckedCreateWithoutHospitalInput>
  }

  export type UserHospitalAccessCreateManyHospitalInputEnvelope = {
    data: UserHospitalAccessCreateManyHospitalInput | UserHospitalAccessCreateManyHospitalInput[]
    skipDuplicates?: boolean
  }

  export type HospitalUpsertWithoutChildHospitalInput = {
    update: XOR<HospitalUpdateWithoutChildHospitalInput, HospitalUncheckedUpdateWithoutChildHospitalInput>
    create: XOR<HospitalCreateWithoutChildHospitalInput, HospitalUncheckedCreateWithoutChildHospitalInput>
    where?: HospitalWhereInput
  }

  export type HospitalUpdateToOneWithWhereWithoutChildHospitalInput = {
    where?: HospitalWhereInput
    data: XOR<HospitalUpdateWithoutChildHospitalInput, HospitalUncheckedUpdateWithoutChildHospitalInput>
  }

  export type HospitalUpdateWithoutChildHospitalInput = {
    name?: StringFieldUpdateOperationsInput | string
    hospitalCode?: StringFieldUpdateOperationsInput | string
    ParentHospitalCode?: NullableStringFieldUpdateOperationsInput | string | null
    Organizationcode?: NullableStringFieldUpdateOperationsInput | string | null
    SpecializationType?: EnumSpecializationTypeFieldUpdateOperationsInput | $Enums.SpecializationType
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    level?: EnumHospitalLevelFieldUpdateOperationsInput | $Enums.HospitalLevel
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentHospital?: HospitalUpdateOneWithoutChildHospitalNestedInput
    Organization?: OrganizationUpdateOneRequiredWithoutHospitalsNestedInput
    users?: UserHospitalAccessUpdateManyWithoutHospitalNestedInput
  }

  export type HospitalUncheckedUpdateWithoutChildHospitalInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    hospitalCode?: StringFieldUpdateOperationsInput | string
    ParentHospitalCode?: NullableStringFieldUpdateOperationsInput | string | null
    Organizationcode?: NullableStringFieldUpdateOperationsInput | string | null
    SpecializationType?: EnumSpecializationTypeFieldUpdateOperationsInput | $Enums.SpecializationType
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    level?: EnumHospitalLevelFieldUpdateOperationsInput | $Enums.HospitalLevel
    parentHospitalId?: NullableIntFieldUpdateOperationsInput | number | null
    organizationId?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    users?: UserHospitalAccessUncheckedUpdateManyWithoutHospitalNestedInput
  }

  export type HospitalUpsertWithWhereUniqueWithoutParentHospitalInput = {
    where: HospitalWhereUniqueInput
    update: XOR<HospitalUpdateWithoutParentHospitalInput, HospitalUncheckedUpdateWithoutParentHospitalInput>
    create: XOR<HospitalCreateWithoutParentHospitalInput, HospitalUncheckedCreateWithoutParentHospitalInput>
  }

  export type HospitalUpdateWithWhereUniqueWithoutParentHospitalInput = {
    where: HospitalWhereUniqueInput
    data: XOR<HospitalUpdateWithoutParentHospitalInput, HospitalUncheckedUpdateWithoutParentHospitalInput>
  }

  export type HospitalUpdateManyWithWhereWithoutParentHospitalInput = {
    where: HospitalScalarWhereInput
    data: XOR<HospitalUpdateManyMutationInput, HospitalUncheckedUpdateManyWithoutParentHospitalInput>
  }

  export type OrganizationUpsertWithoutHospitalsInput = {
    update: XOR<OrganizationUpdateWithoutHospitalsInput, OrganizationUncheckedUpdateWithoutHospitalsInput>
    create: XOR<OrganizationCreateWithoutHospitalsInput, OrganizationUncheckedCreateWithoutHospitalsInput>
    where?: OrganizationWhereInput
  }

  export type OrganizationUpdateToOneWithWhereWithoutHospitalsInput = {
    where?: OrganizationWhereInput
    data: XOR<OrganizationUpdateWithoutHospitalsInput, OrganizationUncheckedUpdateWithoutHospitalsInput>
  }

  export type OrganizationUpdateWithoutHospitalsInput = {
    OrganizationName?: StringFieldUpdateOperationsInput | string
    Organizationcode?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    Orgnizationtype?: NullableEnumOrganizationTypeFieldUpdateOperationsInput | $Enums.OrganizationType | null
    website?: StringFieldUpdateOperationsInput | string
    addressLine1?: StringFieldUpdateOperationsInput | string
    addressLine2?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    establishedOn?: DateTimeFieldUpdateOperationsInput | Date | string
    industryType?: StringFieldUpdateOperationsInput | string
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutOrganizationNestedInput
  }

  export type OrganizationUncheckedUpdateWithoutHospitalsInput = {
    id?: IntFieldUpdateOperationsInput | number
    OrganizationName?: StringFieldUpdateOperationsInput | string
    Organizationcode?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    Orgnizationtype?: NullableEnumOrganizationTypeFieldUpdateOperationsInput | $Enums.OrganizationType | null
    website?: StringFieldUpdateOperationsInput | string
    addressLine1?: StringFieldUpdateOperationsInput | string
    addressLine2?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    registrationNo?: StringFieldUpdateOperationsInput | string
    establishedOn?: DateTimeFieldUpdateOperationsInput | Date | string
    industryType?: StringFieldUpdateOperationsInput | string
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutOrganizationNestedInput
  }

  export type UserHospitalAccessUpsertWithWhereUniqueWithoutHospitalInput = {
    where: UserHospitalAccessWhereUniqueInput
    update: XOR<UserHospitalAccessUpdateWithoutHospitalInput, UserHospitalAccessUncheckedUpdateWithoutHospitalInput>
    create: XOR<UserHospitalAccessCreateWithoutHospitalInput, UserHospitalAccessUncheckedCreateWithoutHospitalInput>
  }

  export type UserHospitalAccessUpdateWithWhereUniqueWithoutHospitalInput = {
    where: UserHospitalAccessWhereUniqueInput
    data: XOR<UserHospitalAccessUpdateWithoutHospitalInput, UserHospitalAccessUncheckedUpdateWithoutHospitalInput>
  }

  export type UserHospitalAccessUpdateManyWithWhereWithoutHospitalInput = {
    where: UserHospitalAccessScalarWhereInput
    data: XOR<UserHospitalAccessUpdateManyMutationInput, UserHospitalAccessUncheckedUpdateManyWithoutHospitalInput>
  }

  export type UserCreateWithoutAdminAccessInput = {
    title: $Enums.Title
    imageUrl: string
    firstName: string
    lastName: string
    gender: string
    email: string
    mobile: string
    passwordHash: string
    isActive?: boolean
    hashedRefreshToken: string
    dateOfBirth: Date | string
    deletedAt?: Date | string | null
    role: RoleCreateNestedOneWithoutUsersInput
    organization: OrganizationCreateNestedOneWithoutUsersInput
    settings?: SettingCreateNestedOneWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    loginSessions?: LoginSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAdminAccessInput = {
    id?: number
    title: $Enums.Title
    imageUrl: string
    firstName: string
    lastName: string
    gender: string
    email: string
    mobile: string
    passwordHash: string
    isActive?: boolean
    hashedRefreshToken: string
    dateOfBirth: Date | string
    roleId: number
    organizationId: number
    deletedAt?: Date | string | null
    settings?: SettingUncheckedCreateNestedOneWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    loginSessions?: LoginSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAdminAccessInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAdminAccessInput, UserUncheckedCreateWithoutAdminAccessInput>
  }

  export type HospitalCreateWithoutUsersInput = {
    name: string
    hospitalCode: string
    ParentHospitalCode?: string | null
    Organizationcode?: string | null
    SpecializationType: $Enums.SpecializationType
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    contactNumber: string
    email: string
    website: string
    logoUrl: string
    latitude: number
    longitude: number
    status?: $Enums.Hospital_Org_status
    level: $Enums.HospitalLevel
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    parentHospital?: HospitalCreateNestedOneWithoutChildHospitalInput
    childHospital?: HospitalCreateNestedManyWithoutParentHospitalInput
    Organization: OrganizationCreateNestedOneWithoutHospitalsInput
  }

  export type HospitalUncheckedCreateWithoutUsersInput = {
    id?: number
    name: string
    hospitalCode: string
    ParentHospitalCode?: string | null
    Organizationcode?: string | null
    SpecializationType: $Enums.SpecializationType
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    contactNumber: string
    email: string
    website: string
    logoUrl: string
    latitude: number
    longitude: number
    status?: $Enums.Hospital_Org_status
    level: $Enums.HospitalLevel
    parentHospitalId?: number | null
    organizationId: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
    childHospital?: HospitalUncheckedCreateNestedManyWithoutParentHospitalInput
  }

  export type HospitalCreateOrConnectWithoutUsersInput = {
    where: HospitalWhereUniqueInput
    create: XOR<HospitalCreateWithoutUsersInput, HospitalUncheckedCreateWithoutUsersInput>
  }

  export type RoleCreateWithoutUserHospitalAccessInput = {
    Rolename: string
    description: string
    isActive?: boolean
    users?: UserCreateNestedManyWithoutRoleInput
    permissions?: RolePermissionCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateWithoutUserHospitalAccessInput = {
    id?: number
    Rolename: string
    description: string
    isActive?: boolean
    users?: UserUncheckedCreateNestedManyWithoutRoleInput
    permissions?: RolePermissionUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleCreateOrConnectWithoutUserHospitalAccessInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutUserHospitalAccessInput, RoleUncheckedCreateWithoutUserHospitalAccessInput>
  }

  export type UserUpsertWithoutAdminAccessInput = {
    update: XOR<UserUpdateWithoutAdminAccessInput, UserUncheckedUpdateWithoutAdminAccessInput>
    create: XOR<UserCreateWithoutAdminAccessInput, UserUncheckedCreateWithoutAdminAccessInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAdminAccessInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAdminAccessInput, UserUncheckedUpdateWithoutAdminAccessInput>
  }

  export type UserUpdateWithoutAdminAccessInput = {
    title?: EnumTitleFieldUpdateOperationsInput | $Enums.Title
    imageUrl?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    hashedRefreshToken?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: RoleUpdateOneRequiredWithoutUsersNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutUsersNestedInput
    settings?: SettingUpdateOneWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    loginSessions?: LoginSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAdminAccessInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: EnumTitleFieldUpdateOperationsInput | $Enums.Title
    imageUrl?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    hashedRefreshToken?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    roleId?: IntFieldUpdateOperationsInput | number
    organizationId?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settings?: SettingUncheckedUpdateOneWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    loginSessions?: LoginSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type HospitalUpsertWithoutUsersInput = {
    update: XOR<HospitalUpdateWithoutUsersInput, HospitalUncheckedUpdateWithoutUsersInput>
    create: XOR<HospitalCreateWithoutUsersInput, HospitalUncheckedCreateWithoutUsersInput>
    where?: HospitalWhereInput
  }

  export type HospitalUpdateToOneWithWhereWithoutUsersInput = {
    where?: HospitalWhereInput
    data: XOR<HospitalUpdateWithoutUsersInput, HospitalUncheckedUpdateWithoutUsersInput>
  }

  export type HospitalUpdateWithoutUsersInput = {
    name?: StringFieldUpdateOperationsInput | string
    hospitalCode?: StringFieldUpdateOperationsInput | string
    ParentHospitalCode?: NullableStringFieldUpdateOperationsInput | string | null
    Organizationcode?: NullableStringFieldUpdateOperationsInput | string | null
    SpecializationType?: EnumSpecializationTypeFieldUpdateOperationsInput | $Enums.SpecializationType
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    level?: EnumHospitalLevelFieldUpdateOperationsInput | $Enums.HospitalLevel
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentHospital?: HospitalUpdateOneWithoutChildHospitalNestedInput
    childHospital?: HospitalUpdateManyWithoutParentHospitalNestedInput
    Organization?: OrganizationUpdateOneRequiredWithoutHospitalsNestedInput
  }

  export type HospitalUncheckedUpdateWithoutUsersInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    hospitalCode?: StringFieldUpdateOperationsInput | string
    ParentHospitalCode?: NullableStringFieldUpdateOperationsInput | string | null
    Organizationcode?: NullableStringFieldUpdateOperationsInput | string | null
    SpecializationType?: EnumSpecializationTypeFieldUpdateOperationsInput | $Enums.SpecializationType
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    level?: EnumHospitalLevelFieldUpdateOperationsInput | $Enums.HospitalLevel
    parentHospitalId?: NullableIntFieldUpdateOperationsInput | number | null
    organizationId?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    childHospital?: HospitalUncheckedUpdateManyWithoutParentHospitalNestedInput
  }

  export type RoleUpsertWithoutUserHospitalAccessInput = {
    update: XOR<RoleUpdateWithoutUserHospitalAccessInput, RoleUncheckedUpdateWithoutUserHospitalAccessInput>
    create: XOR<RoleCreateWithoutUserHospitalAccessInput, RoleUncheckedCreateWithoutUserHospitalAccessInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutUserHospitalAccessInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutUserHospitalAccessInput, RoleUncheckedUpdateWithoutUserHospitalAccessInput>
  }

  export type RoleUpdateWithoutUserHospitalAccessInput = {
    Rolename?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUpdateManyWithoutRoleNestedInput
    permissions?: RolePermissionUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateWithoutUserHospitalAccessInput = {
    id?: IntFieldUpdateOperationsInput | number
    Rolename?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUncheckedUpdateManyWithoutRoleNestedInput
    permissions?: RolePermissionUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type UserCreateWithoutSettingsInput = {
    title: $Enums.Title
    imageUrl: string
    firstName: string
    lastName: string
    gender: string
    email: string
    mobile: string
    passwordHash: string
    isActive?: boolean
    hashedRefreshToken: string
    dateOfBirth: Date | string
    deletedAt?: Date | string | null
    role: RoleCreateNestedOneWithoutUsersInput
    organization: OrganizationCreateNestedOneWithoutUsersInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    loginSessions?: LoginSessionCreateNestedManyWithoutUserInput
    AdminAccess?: UserHospitalAccessCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutSettingsInput = {
    id?: number
    title: $Enums.Title
    imageUrl: string
    firstName: string
    lastName: string
    gender: string
    email: string
    mobile: string
    passwordHash: string
    isActive?: boolean
    hashedRefreshToken: string
    dateOfBirth: Date | string
    roleId: number
    organizationId: number
    deletedAt?: Date | string | null
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    loginSessions?: LoginSessionUncheckedCreateNestedManyWithoutUserInput
    AdminAccess?: UserHospitalAccessUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutSettingsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutSettingsInput, UserUncheckedCreateWithoutSettingsInput>
  }

  export type UserUpsertWithoutSettingsInput = {
    update: XOR<UserUpdateWithoutSettingsInput, UserUncheckedUpdateWithoutSettingsInput>
    create: XOR<UserCreateWithoutSettingsInput, UserUncheckedCreateWithoutSettingsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutSettingsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutSettingsInput, UserUncheckedUpdateWithoutSettingsInput>
  }

  export type UserUpdateWithoutSettingsInput = {
    title?: EnumTitleFieldUpdateOperationsInput | $Enums.Title
    imageUrl?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    hashedRefreshToken?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: RoleUpdateOneRequiredWithoutUsersNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutUsersNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    loginSessions?: LoginSessionUpdateManyWithoutUserNestedInput
    AdminAccess?: UserHospitalAccessUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutSettingsInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: EnumTitleFieldUpdateOperationsInput | $Enums.Title
    imageUrl?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    hashedRefreshToken?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    roleId?: IntFieldUpdateOperationsInput | number
    organizationId?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    loginSessions?: LoginSessionUncheckedUpdateManyWithoutUserNestedInput
    AdminAccess?: UserHospitalAccessUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutAuditLogsInput = {
    title: $Enums.Title
    imageUrl: string
    firstName: string
    lastName: string
    gender: string
    email: string
    mobile: string
    passwordHash: string
    isActive?: boolean
    hashedRefreshToken: string
    dateOfBirth: Date | string
    deletedAt?: Date | string | null
    role: RoleCreateNestedOneWithoutUsersInput
    organization: OrganizationCreateNestedOneWithoutUsersInput
    settings?: SettingCreateNestedOneWithoutUserInput
    loginSessions?: LoginSessionCreateNestedManyWithoutUserInput
    AdminAccess?: UserHospitalAccessCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAuditLogsInput = {
    id?: number
    title: $Enums.Title
    imageUrl: string
    firstName: string
    lastName: string
    gender: string
    email: string
    mobile: string
    passwordHash: string
    isActive?: boolean
    hashedRefreshToken: string
    dateOfBirth: Date | string
    roleId: number
    organizationId: number
    deletedAt?: Date | string | null
    settings?: SettingUncheckedCreateNestedOneWithoutUserInput
    loginSessions?: LoginSessionUncheckedCreateNestedManyWithoutUserInput
    AdminAccess?: UserHospitalAccessUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAuditLogsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
  }

  export type UserUpsertWithoutAuditLogsInput = {
    update: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
    create: XOR<UserCreateWithoutAuditLogsInput, UserUncheckedCreateWithoutAuditLogsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAuditLogsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAuditLogsInput, UserUncheckedUpdateWithoutAuditLogsInput>
  }

  export type UserUpdateWithoutAuditLogsInput = {
    title?: EnumTitleFieldUpdateOperationsInput | $Enums.Title
    imageUrl?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    hashedRefreshToken?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: RoleUpdateOneRequiredWithoutUsersNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutUsersNestedInput
    settings?: SettingUpdateOneWithoutUserNestedInput
    loginSessions?: LoginSessionUpdateManyWithoutUserNestedInput
    AdminAccess?: UserHospitalAccessUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAuditLogsInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: EnumTitleFieldUpdateOperationsInput | $Enums.Title
    imageUrl?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    hashedRefreshToken?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    roleId?: IntFieldUpdateOperationsInput | number
    organizationId?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settings?: SettingUncheckedUpdateOneWithoutUserNestedInput
    loginSessions?: LoginSessionUncheckedUpdateManyWithoutUserNestedInput
    AdminAccess?: UserHospitalAccessUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutLoginSessionsInput = {
    title: $Enums.Title
    imageUrl: string
    firstName: string
    lastName: string
    gender: string
    email: string
    mobile: string
    passwordHash: string
    isActive?: boolean
    hashedRefreshToken: string
    dateOfBirth: Date | string
    deletedAt?: Date | string | null
    role: RoleCreateNestedOneWithoutUsersInput
    organization: OrganizationCreateNestedOneWithoutUsersInput
    settings?: SettingCreateNestedOneWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    AdminAccess?: UserHospitalAccessCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLoginSessionsInput = {
    id?: number
    title: $Enums.Title
    imageUrl: string
    firstName: string
    lastName: string
    gender: string
    email: string
    mobile: string
    passwordHash: string
    isActive?: boolean
    hashedRefreshToken: string
    dateOfBirth: Date | string
    roleId: number
    organizationId: number
    deletedAt?: Date | string | null
    settings?: SettingUncheckedCreateNestedOneWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    AdminAccess?: UserHospitalAccessUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLoginSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLoginSessionsInput, UserUncheckedCreateWithoutLoginSessionsInput>
  }

  export type UserUpsertWithoutLoginSessionsInput = {
    update: XOR<UserUpdateWithoutLoginSessionsInput, UserUncheckedUpdateWithoutLoginSessionsInput>
    create: XOR<UserCreateWithoutLoginSessionsInput, UserUncheckedCreateWithoutLoginSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLoginSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLoginSessionsInput, UserUncheckedUpdateWithoutLoginSessionsInput>
  }

  export type UserUpdateWithoutLoginSessionsInput = {
    title?: EnumTitleFieldUpdateOperationsInput | $Enums.Title
    imageUrl?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    hashedRefreshToken?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: RoleUpdateOneRequiredWithoutUsersNestedInput
    organization?: OrganizationUpdateOneRequiredWithoutUsersNestedInput
    settings?: SettingUpdateOneWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    AdminAccess?: UserHospitalAccessUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLoginSessionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: EnumTitleFieldUpdateOperationsInput | $Enums.Title
    imageUrl?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    hashedRefreshToken?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    roleId?: IntFieldUpdateOperationsInput | number
    organizationId?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settings?: SettingUncheckedUpdateOneWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    AdminAccess?: UserHospitalAccessUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutRoleInput = {
    title: $Enums.Title
    imageUrl: string
    firstName: string
    lastName: string
    gender: string
    email: string
    mobile: string
    passwordHash: string
    isActive?: boolean
    hashedRefreshToken: string
    dateOfBirth: Date | string
    deletedAt?: Date | string | null
    organization: OrganizationCreateNestedOneWithoutUsersInput
    settings?: SettingCreateNestedOneWithoutUserInput
    auditLogs?: AuditLogCreateNestedManyWithoutUserInput
    loginSessions?: LoginSessionCreateNestedManyWithoutUserInput
    AdminAccess?: UserHospitalAccessCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutRoleInput = {
    id?: number
    title: $Enums.Title
    imageUrl: string
    firstName: string
    lastName: string
    gender: string
    email: string
    mobile: string
    passwordHash: string
    isActive?: boolean
    hashedRefreshToken: string
    dateOfBirth: Date | string
    organizationId: number
    deletedAt?: Date | string | null
    settings?: SettingUncheckedCreateNestedOneWithoutUserInput
    auditLogs?: AuditLogUncheckedCreateNestedManyWithoutUserInput
    loginSessions?: LoginSessionUncheckedCreateNestedManyWithoutUserInput
    AdminAccess?: UserHospitalAccessUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutRoleInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutRoleInput, UserUncheckedCreateWithoutRoleInput>
  }

  export type UserCreateManyRoleInputEnvelope = {
    data: UserCreateManyRoleInput | UserCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type UserHospitalAccessCreateWithoutRoleInput = {
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAdminAccessInput
    hospital: HospitalCreateNestedOneWithoutUsersInput
  }

  export type UserHospitalAccessUncheckedCreateWithoutRoleInput = {
    id?: number
    userId: number
    hospitalId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserHospitalAccessCreateOrConnectWithoutRoleInput = {
    where: UserHospitalAccessWhereUniqueInput
    create: XOR<UserHospitalAccessCreateWithoutRoleInput, UserHospitalAccessUncheckedCreateWithoutRoleInput>
  }

  export type UserHospitalAccessCreateManyRoleInputEnvelope = {
    data: UserHospitalAccessCreateManyRoleInput | UserHospitalAccessCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type RolePermissionCreateWithoutRoleInput = {
    permission: PermissionCreateNestedOneWithoutRolesInput
  }

  export type RolePermissionUncheckedCreateWithoutRoleInput = {
    id?: number
    permissionId: number
  }

  export type RolePermissionCreateOrConnectWithoutRoleInput = {
    where: RolePermissionWhereUniqueInput
    create: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput>
  }

  export type RolePermissionCreateManyRoleInputEnvelope = {
    data: RolePermissionCreateManyRoleInput | RolePermissionCreateManyRoleInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutRoleInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutRoleInput, UserUncheckedUpdateWithoutRoleInput>
    create: XOR<UserCreateWithoutRoleInput, UserUncheckedCreateWithoutRoleInput>
  }

  export type UserUpdateWithWhereUniqueWithoutRoleInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutRoleInput, UserUncheckedUpdateWithoutRoleInput>
  }

  export type UserUpdateManyWithWhereWithoutRoleInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutRoleInput>
  }

  export type UserHospitalAccessUpsertWithWhereUniqueWithoutRoleInput = {
    where: UserHospitalAccessWhereUniqueInput
    update: XOR<UserHospitalAccessUpdateWithoutRoleInput, UserHospitalAccessUncheckedUpdateWithoutRoleInput>
    create: XOR<UserHospitalAccessCreateWithoutRoleInput, UserHospitalAccessUncheckedCreateWithoutRoleInput>
  }

  export type UserHospitalAccessUpdateWithWhereUniqueWithoutRoleInput = {
    where: UserHospitalAccessWhereUniqueInput
    data: XOR<UserHospitalAccessUpdateWithoutRoleInput, UserHospitalAccessUncheckedUpdateWithoutRoleInput>
  }

  export type UserHospitalAccessUpdateManyWithWhereWithoutRoleInput = {
    where: UserHospitalAccessScalarWhereInput
    data: XOR<UserHospitalAccessUpdateManyMutationInput, UserHospitalAccessUncheckedUpdateManyWithoutRoleInput>
  }

  export type RolePermissionUpsertWithWhereUniqueWithoutRoleInput = {
    where: RolePermissionWhereUniqueInput
    update: XOR<RolePermissionUpdateWithoutRoleInput, RolePermissionUncheckedUpdateWithoutRoleInput>
    create: XOR<RolePermissionCreateWithoutRoleInput, RolePermissionUncheckedCreateWithoutRoleInput>
  }

  export type RolePermissionUpdateWithWhereUniqueWithoutRoleInput = {
    where: RolePermissionWhereUniqueInput
    data: XOR<RolePermissionUpdateWithoutRoleInput, RolePermissionUncheckedUpdateWithoutRoleInput>
  }

  export type RolePermissionUpdateManyWithWhereWithoutRoleInput = {
    where: RolePermissionScalarWhereInput
    data: XOR<RolePermissionUpdateManyMutationInput, RolePermissionUncheckedUpdateManyWithoutRoleInput>
  }

  export type RolePermissionScalarWhereInput = {
    AND?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
    OR?: RolePermissionScalarWhereInput[]
    NOT?: RolePermissionScalarWhereInput | RolePermissionScalarWhereInput[]
    id?: IntFilter<"RolePermission"> | number
    roleId?: IntFilter<"RolePermission"> | number
    permissionId?: IntFilter<"RolePermission"> | number
  }

  export type RoleCreateWithoutPermissionsInput = {
    Rolename: string
    description: string
    isActive?: boolean
    users?: UserCreateNestedManyWithoutRoleInput
    UserHospitalAccess?: UserHospitalAccessCreateNestedManyWithoutRoleInput
  }

  export type RoleUncheckedCreateWithoutPermissionsInput = {
    id?: number
    Rolename: string
    description: string
    isActive?: boolean
    users?: UserUncheckedCreateNestedManyWithoutRoleInput
    UserHospitalAccess?: UserHospitalAccessUncheckedCreateNestedManyWithoutRoleInput
  }

  export type RoleCreateOrConnectWithoutPermissionsInput = {
    where: RoleWhereUniqueInput
    create: XOR<RoleCreateWithoutPermissionsInput, RoleUncheckedCreateWithoutPermissionsInput>
  }

  export type PermissionCreateWithoutRolesInput = {
    name: string
    displayName: string
    category: string
    description?: string | null
  }

  export type PermissionUncheckedCreateWithoutRolesInput = {
    id?: number
    name: string
    displayName: string
    category: string
    description?: string | null
  }

  export type PermissionCreateOrConnectWithoutRolesInput = {
    where: PermissionWhereUniqueInput
    create: XOR<PermissionCreateWithoutRolesInput, PermissionUncheckedCreateWithoutRolesInput>
  }

  export type RoleUpsertWithoutPermissionsInput = {
    update: XOR<RoleUpdateWithoutPermissionsInput, RoleUncheckedUpdateWithoutPermissionsInput>
    create: XOR<RoleCreateWithoutPermissionsInput, RoleUncheckedCreateWithoutPermissionsInput>
    where?: RoleWhereInput
  }

  export type RoleUpdateToOneWithWhereWithoutPermissionsInput = {
    where?: RoleWhereInput
    data: XOR<RoleUpdateWithoutPermissionsInput, RoleUncheckedUpdateWithoutPermissionsInput>
  }

  export type RoleUpdateWithoutPermissionsInput = {
    Rolename?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUpdateManyWithoutRoleNestedInput
    UserHospitalAccess?: UserHospitalAccessUpdateManyWithoutRoleNestedInput
  }

  export type RoleUncheckedUpdateWithoutPermissionsInput = {
    id?: IntFieldUpdateOperationsInput | number
    Rolename?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    users?: UserUncheckedUpdateManyWithoutRoleNestedInput
    UserHospitalAccess?: UserHospitalAccessUncheckedUpdateManyWithoutRoleNestedInput
  }

  export type PermissionUpsertWithoutRolesInput = {
    update: XOR<PermissionUpdateWithoutRolesInput, PermissionUncheckedUpdateWithoutRolesInput>
    create: XOR<PermissionCreateWithoutRolesInput, PermissionUncheckedCreateWithoutRolesInput>
    where?: PermissionWhereInput
  }

  export type PermissionUpdateToOneWithWhereWithoutRolesInput = {
    where?: PermissionWhereInput
    data: XOR<PermissionUpdateWithoutRolesInput, PermissionUncheckedUpdateWithoutRolesInput>
  }

  export type PermissionUpdateWithoutRolesInput = {
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PermissionUncheckedUpdateWithoutRolesInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type RolePermissionCreateWithoutPermissionInput = {
    role: RoleCreateNestedOneWithoutPermissionsInput
  }

  export type RolePermissionUncheckedCreateWithoutPermissionInput = {
    id?: number
    roleId: number
  }

  export type RolePermissionCreateOrConnectWithoutPermissionInput = {
    where: RolePermissionWhereUniqueInput
    create: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput>
  }

  export type RolePermissionCreateManyPermissionInputEnvelope = {
    data: RolePermissionCreateManyPermissionInput | RolePermissionCreateManyPermissionInput[]
    skipDuplicates?: boolean
  }

  export type RolePermissionUpsertWithWhereUniqueWithoutPermissionInput = {
    where: RolePermissionWhereUniqueInput
    update: XOR<RolePermissionUpdateWithoutPermissionInput, RolePermissionUncheckedUpdateWithoutPermissionInput>
    create: XOR<RolePermissionCreateWithoutPermissionInput, RolePermissionUncheckedCreateWithoutPermissionInput>
  }

  export type RolePermissionUpdateWithWhereUniqueWithoutPermissionInput = {
    where: RolePermissionWhereUniqueInput
    data: XOR<RolePermissionUpdateWithoutPermissionInput, RolePermissionUncheckedUpdateWithoutPermissionInput>
  }

  export type RolePermissionUpdateManyWithWhereWithoutPermissionInput = {
    where: RolePermissionScalarWhereInput
    data: XOR<RolePermissionUpdateManyMutationInput, RolePermissionUncheckedUpdateManyWithoutPermissionInput>
  }

  export type AuditLogCreateManyUserInput = {
    id?: number
    action: string
    entity: string
    entityId?: number | null
    timestamp?: Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type LoginSessionCreateManyUserInput = {
    id?: number
    ipAddress: string
    userAgent: string
    loginAt?: Date | string
  }

  export type UserHospitalAccessCreateManyUserInput = {
    id?: number
    hospitalId: number
    roleId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AuditLogUpdateWithoutUserInput = {
    action?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: NullableIntFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: NullableIntFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type AuditLogUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    action?: StringFieldUpdateOperationsInput | string
    entity?: StringFieldUpdateOperationsInput | string
    entityId?: NullableIntFieldUpdateOperationsInput | number | null
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    metadata?: NullableJsonNullValueInput | InputJsonValue
  }

  export type LoginSessionUpdateWithoutUserInput = {
    ipAddress?: StringFieldUpdateOperationsInput | string
    userAgent?: StringFieldUpdateOperationsInput | string
    loginAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginSessionUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    ipAddress?: StringFieldUpdateOperationsInput | string
    userAgent?: StringFieldUpdateOperationsInput | string
    loginAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LoginSessionUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    ipAddress?: StringFieldUpdateOperationsInput | string
    userAgent?: StringFieldUpdateOperationsInput | string
    loginAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserHospitalAccessUpdateWithoutUserInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    hospital?: HospitalUpdateOneRequiredWithoutUsersNestedInput
    role?: RoleUpdateOneRequiredWithoutUserHospitalAccessNestedInput
  }

  export type UserHospitalAccessUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    hospitalId?: IntFieldUpdateOperationsInput | number
    roleId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserHospitalAccessUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    hospitalId?: IntFieldUpdateOperationsInput | number
    roleId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type HospitalCreateManyOrganizationInput = {
    id?: number
    name: string
    hospitalCode: string
    ParentHospitalCode?: string | null
    Organizationcode?: string | null
    SpecializationType: $Enums.SpecializationType
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    contactNumber: string
    email: string
    website: string
    logoUrl: string
    latitude: number
    longitude: number
    status?: $Enums.Hospital_Org_status
    level: $Enums.HospitalLevel
    parentHospitalId?: number | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type UserCreateManyOrganizationInput = {
    id?: number
    title: $Enums.Title
    imageUrl: string
    firstName: string
    lastName: string
    gender: string
    email: string
    mobile: string
    passwordHash: string
    isActive?: boolean
    hashedRefreshToken: string
    dateOfBirth: Date | string
    roleId: number
    deletedAt?: Date | string | null
  }

  export type HospitalUpdateWithoutOrganizationInput = {
    name?: StringFieldUpdateOperationsInput | string
    hospitalCode?: StringFieldUpdateOperationsInput | string
    ParentHospitalCode?: NullableStringFieldUpdateOperationsInput | string | null
    Organizationcode?: NullableStringFieldUpdateOperationsInput | string | null
    SpecializationType?: EnumSpecializationTypeFieldUpdateOperationsInput | $Enums.SpecializationType
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    level?: EnumHospitalLevelFieldUpdateOperationsInput | $Enums.HospitalLevel
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    parentHospital?: HospitalUpdateOneWithoutChildHospitalNestedInput
    childHospital?: HospitalUpdateManyWithoutParentHospitalNestedInput
    users?: UserHospitalAccessUpdateManyWithoutHospitalNestedInput
  }

  export type HospitalUncheckedUpdateWithoutOrganizationInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    hospitalCode?: StringFieldUpdateOperationsInput | string
    ParentHospitalCode?: NullableStringFieldUpdateOperationsInput | string | null
    Organizationcode?: NullableStringFieldUpdateOperationsInput | string | null
    SpecializationType?: EnumSpecializationTypeFieldUpdateOperationsInput | $Enums.SpecializationType
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    level?: EnumHospitalLevelFieldUpdateOperationsInput | $Enums.HospitalLevel
    parentHospitalId?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    childHospital?: HospitalUncheckedUpdateManyWithoutParentHospitalNestedInput
    users?: UserHospitalAccessUncheckedUpdateManyWithoutHospitalNestedInput
  }

  export type HospitalUncheckedUpdateManyWithoutOrganizationInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    hospitalCode?: StringFieldUpdateOperationsInput | string
    ParentHospitalCode?: NullableStringFieldUpdateOperationsInput | string | null
    Organizationcode?: NullableStringFieldUpdateOperationsInput | string | null
    SpecializationType?: EnumSpecializationTypeFieldUpdateOperationsInput | $Enums.SpecializationType
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    level?: EnumHospitalLevelFieldUpdateOperationsInput | $Enums.HospitalLevel
    parentHospitalId?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserUpdateWithoutOrganizationInput = {
    title?: EnumTitleFieldUpdateOperationsInput | $Enums.Title
    imageUrl?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    hashedRefreshToken?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    role?: RoleUpdateOneRequiredWithoutUsersNestedInput
    settings?: SettingUpdateOneWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    loginSessions?: LoginSessionUpdateManyWithoutUserNestedInput
    AdminAccess?: UserHospitalAccessUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutOrganizationInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: EnumTitleFieldUpdateOperationsInput | $Enums.Title
    imageUrl?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    hashedRefreshToken?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    roleId?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settings?: SettingUncheckedUpdateOneWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    loginSessions?: LoginSessionUncheckedUpdateManyWithoutUserNestedInput
    AdminAccess?: UserHospitalAccessUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutOrganizationInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: EnumTitleFieldUpdateOperationsInput | $Enums.Title
    imageUrl?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    hashedRefreshToken?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    roleId?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type HospitalCreateManyParentHospitalInput = {
    id?: number
    name: string
    hospitalCode: string
    ParentHospitalCode?: string | null
    Organizationcode?: string | null
    SpecializationType: $Enums.SpecializationType
    address: string
    city: string
    state: string
    country: string
    postalCode: string
    contactNumber: string
    email: string
    website: string
    logoUrl: string
    latitude: number
    longitude: number
    status?: $Enums.Hospital_Org_status
    level: $Enums.HospitalLevel
    organizationId: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    deletedAt?: Date | string | null
  }

  export type UserHospitalAccessCreateManyHospitalInput = {
    id?: number
    userId: number
    roleId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type HospitalUpdateWithoutParentHospitalInput = {
    name?: StringFieldUpdateOperationsInput | string
    hospitalCode?: StringFieldUpdateOperationsInput | string
    ParentHospitalCode?: NullableStringFieldUpdateOperationsInput | string | null
    Organizationcode?: NullableStringFieldUpdateOperationsInput | string | null
    SpecializationType?: EnumSpecializationTypeFieldUpdateOperationsInput | $Enums.SpecializationType
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    level?: EnumHospitalLevelFieldUpdateOperationsInput | $Enums.HospitalLevel
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    childHospital?: HospitalUpdateManyWithoutParentHospitalNestedInput
    Organization?: OrganizationUpdateOneRequiredWithoutHospitalsNestedInput
    users?: UserHospitalAccessUpdateManyWithoutHospitalNestedInput
  }

  export type HospitalUncheckedUpdateWithoutParentHospitalInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    hospitalCode?: StringFieldUpdateOperationsInput | string
    ParentHospitalCode?: NullableStringFieldUpdateOperationsInput | string | null
    Organizationcode?: NullableStringFieldUpdateOperationsInput | string | null
    SpecializationType?: EnumSpecializationTypeFieldUpdateOperationsInput | $Enums.SpecializationType
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    level?: EnumHospitalLevelFieldUpdateOperationsInput | $Enums.HospitalLevel
    organizationId?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    childHospital?: HospitalUncheckedUpdateManyWithoutParentHospitalNestedInput
    users?: UserHospitalAccessUncheckedUpdateManyWithoutHospitalNestedInput
  }

  export type HospitalUncheckedUpdateManyWithoutParentHospitalInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    hospitalCode?: StringFieldUpdateOperationsInput | string
    ParentHospitalCode?: NullableStringFieldUpdateOperationsInput | string | null
    Organizationcode?: NullableStringFieldUpdateOperationsInput | string | null
    SpecializationType?: EnumSpecializationTypeFieldUpdateOperationsInput | $Enums.SpecializationType
    address?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    state?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    postalCode?: StringFieldUpdateOperationsInput | string
    contactNumber?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    website?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    latitude?: FloatFieldUpdateOperationsInput | number
    longitude?: FloatFieldUpdateOperationsInput | number
    status?: EnumHospital_Org_statusFieldUpdateOperationsInput | $Enums.Hospital_Org_status
    level?: EnumHospitalLevelFieldUpdateOperationsInput | $Enums.HospitalLevel
    organizationId?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserHospitalAccessUpdateWithoutHospitalInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAdminAccessNestedInput
    role?: RoleUpdateOneRequiredWithoutUserHospitalAccessNestedInput
  }

  export type UserHospitalAccessUncheckedUpdateWithoutHospitalInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    roleId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserHospitalAccessUncheckedUpdateManyWithoutHospitalInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    roleId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyRoleInput = {
    id?: number
    title: $Enums.Title
    imageUrl: string
    firstName: string
    lastName: string
    gender: string
    email: string
    mobile: string
    passwordHash: string
    isActive?: boolean
    hashedRefreshToken: string
    dateOfBirth: Date | string
    organizationId: number
    deletedAt?: Date | string | null
  }

  export type UserHospitalAccessCreateManyRoleInput = {
    id?: number
    userId: number
    hospitalId: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type RolePermissionCreateManyRoleInput = {
    id?: number
    permissionId: number
  }

  export type UserUpdateWithoutRoleInput = {
    title?: EnumTitleFieldUpdateOperationsInput | $Enums.Title
    imageUrl?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    hashedRefreshToken?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    organization?: OrganizationUpdateOneRequiredWithoutUsersNestedInput
    settings?: SettingUpdateOneWithoutUserNestedInput
    auditLogs?: AuditLogUpdateManyWithoutUserNestedInput
    loginSessions?: LoginSessionUpdateManyWithoutUserNestedInput
    AdminAccess?: UserHospitalAccessUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutRoleInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: EnumTitleFieldUpdateOperationsInput | $Enums.Title
    imageUrl?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    hashedRefreshToken?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    organizationId?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    settings?: SettingUncheckedUpdateOneWithoutUserNestedInput
    auditLogs?: AuditLogUncheckedUpdateManyWithoutUserNestedInput
    loginSessions?: LoginSessionUncheckedUpdateManyWithoutUserNestedInput
    AdminAccess?: UserHospitalAccessUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutRoleInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: EnumTitleFieldUpdateOperationsInput | $Enums.Title
    imageUrl?: StringFieldUpdateOperationsInput | string
    firstName?: StringFieldUpdateOperationsInput | string
    lastName?: StringFieldUpdateOperationsInput | string
    gender?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    mobile?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    hashedRefreshToken?: StringFieldUpdateOperationsInput | string
    dateOfBirth?: DateTimeFieldUpdateOperationsInput | Date | string
    organizationId?: IntFieldUpdateOperationsInput | number
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UserHospitalAccessUpdateWithoutRoleInput = {
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAdminAccessNestedInput
    hospital?: HospitalUpdateOneRequiredWithoutUsersNestedInput
  }

  export type UserHospitalAccessUncheckedUpdateWithoutRoleInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    hospitalId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserHospitalAccessUncheckedUpdateManyWithoutRoleInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    hospitalId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type RolePermissionUpdateWithoutRoleInput = {
    permission?: PermissionUpdateOneRequiredWithoutRolesNestedInput
  }

  export type RolePermissionUncheckedUpdateWithoutRoleInput = {
    id?: IntFieldUpdateOperationsInput | number
    permissionId?: IntFieldUpdateOperationsInput | number
  }

  export type RolePermissionUncheckedUpdateManyWithoutRoleInput = {
    id?: IntFieldUpdateOperationsInput | number
    permissionId?: IntFieldUpdateOperationsInput | number
  }

  export type RolePermissionCreateManyPermissionInput = {
    id?: number
    roleId: number
  }

  export type RolePermissionUpdateWithoutPermissionInput = {
    role?: RoleUpdateOneRequiredWithoutPermissionsNestedInput
  }

  export type RolePermissionUncheckedUpdateWithoutPermissionInput = {
    id?: IntFieldUpdateOperationsInput | number
    roleId?: IntFieldUpdateOperationsInput | number
  }

  export type RolePermissionUncheckedUpdateManyWithoutPermissionInput = {
    id?: IntFieldUpdateOperationsInput | number
    roleId?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}