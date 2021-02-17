const Mapper = require("./mapper")

class OrgnizationMapper extends Mapper{
	constructor(debug){
		super('t4_org', debug)
	}
	buildOptimizedWhere(builder, queryForm){
		if(queryForm.queryName){
			builder.where('a.NAME', 'like', `%${queryForm.queryName}%`)
		}
		if(!queryForm.queryAll){
			builder.where('a.VALID', true)
		}
		if(queryForm.queryNoMmt){
			builder.where('a.HAS_MMT', false )
		}
		if(queryForm.queryCity){
			builder.where('a.CITY',queryForm.queryCity)
		}
		if(queryForm.queryArea){
			builder.where('a.AREA',queryForm.queryArea)
		}
		if(queryForm.queryParent)
		{
			builder.where('a.PARENT', queryForm.queryParent)
		}
	}
	columns(){
		return ['a.ID', 'a.UUID', 'a.PARENT', 'a.NAME', 'a.LEVEL', 'a.TYPE', 'a.CITY', 'a.AREA', 'a.ADDRESS',
		'a.TELE',	'a.LINKMAN', 'a.DESCRIPTION', 'a.VALID', 'a.PREFIX', 'a.HAS_MMT', 'a.REQUIRED_SITES',
		'a.CREATOR', 'a.CREATE_TIME',	
		this.db.raw('b.VALUE as CITY_NAME'),
		this.db.raw('c.VALUE as AREA_NAME'),
		this.db.raw('d.NAME as CREATOR_NAME'),
		this.db.raw("ifnull(e.NAME,'') as PARENT_NAME")];
	}
	tableAlias(){
	return {a:'t4_org'}
}
idAlias(){
	return {a:'id'}
}
buildJoins(builder){
	builder.leftJoin({b:'t4_c_area'},'a.CITY','b.ID')
	.leftJoin({ c: 't4_c_area'},'a.AREA','c.ID')
	.leftJoin({d:'t4_user'},'a.CREATOR','d.ID')
	.leftJoin({e:'t4_org'},'a.PARENT','e.ID')
}

selectAll4Tree(){
		select
		<include refid="columns" />
		from (
		<include refid="selectSql" />
		) t
		group by CITY, AREA, ID
		order by PARENT, ID ASC
	</select>
		}
	<select id="selectById" parameterType="java.lang.Long"
		resultMap="orgnizationDetail">
		<include refid="selectSql" />
		where a.ID = #{id,jdbcType=INTEGER}
	</select>

	<insert id="insertDetail" parameterType="com.uc.app.zjjh.domain.OrgnizationForm">
		insert into t4_org (UUID, PARENT, NAME,
		LEVEL, TYPE,CITY, AREA,
		ADDRESS, TELE, LINKMAN,
		DESCRIPTION, VALID,
		PREFIX, HAS_MMT, REQUIRED_SITES,
		CREATOR, CREATE_TIME
		)
		values (#{uuid,jdbcType=VARCHAR}, #{parent,jdbcType=INTEGER},
		#{name,jdbcType=VARCHAR},
		#{level,jdbcType=INTEGER}, #{type,jdbcType=VARCHAR}, #{city,jdbcType=INTEGER},
		#{area,jdbcType=INTEGER}, #{address,jdbcType=VARCHAR},
		#{tele,jdbcType=VARCHAR},
		#{linkman,jdbcType=VARCHAR}, #{description,jdbcType=VARCHAR}, #{valid,jdbcType=BIT},
		#{prefix,jdbcType=VARCHAR}, #{hasMmt, jdbcType=BIT},
		#{requiredSites,jdbcType=INTEGER},
		#{creator,jdbcType=INTEGER}, #{createTime,jdbcType=TIMESTAMP}
		)
	</insert>

	<update id="updateDetailSelective" parameterType="com.uc.app.zjjh.domain.OrgnizationForm">
		update t4_org
		<set>
			<if test="parent != null">
				PARENT = #{parent,jdbcType=INTEGER},
			</if>
			<if test="name != null">
				NAME = #{name,jdbcType=VARCHAR},
			</if>
			<if test="level != null">
				LEVEL = #{level,jdbcType=INTEGER},
			</if>
			<if test="type != null">
				TYPE = #{type,jdbcType=VARCHAR},
			</if>
			<if test="area != null and area != 0">
				AREA = #{area,jdbcType=INTEGER},
			</if>
			<if test="address != null">
				ADDRESS = #{address,jdbcType=VARCHAR},
			</if>
			<if test="tele != null">
				TELE = #{tele,jdbcType=VARCHAR},
			</if>
			<if test="linkman != null">
				LINKMAN = #{linkman,jdbcType=VARCHAR},
			</if>
			<if test="description != null">
				DESCRIPTION = #{description,jdbcType=VARCHAR},
			</if>
			<if test="valid != null">
				VALID = #{valid,jdbcType=BIT},
			</if>
			<if test="city != null and city != 0">
				CITY = #{city,jdbcType=INTEGER},
			</if>
			<if test="prefix != null">
				PREFIX = #{prefix,jdbcType=VARCHAR},
			</if>
			<if test="hasMmt != null">
				HAS_MMT = #{hasMmt,jdbcType=BIT},
			</if>
			<if test="requiredSites !=null and requiredSites != 0">
				REQUIRED_SITES = #{requiredSites, jdbcType=INTEGER}
			</if>
		</set>
		where ID = #{id,jdbcType=INTEGER}
	</update>
	<update id="updateDetail" parameterType="com.uc.app.zjjh.domain.OrgnizationForm">
		update t4_org
		set PARENT = #{parent,jdbcType=INTEGER},
		NAME = #{name,jdbcType=VARCHAR},
		LEVEL = #{level,jdbcType=INTEGER},
		TYPE = #{type,jdbcType=VARCHAR},
		AREA = #{area,jdbcType=VARCHAR},
		ADDRESS = #{address,jdbcType=VARCHAR},
		TELE = #{tele,jdbcType=VARCHAR},
		LINKMAN = #{linkman,jdbcType=VARCHAR},
		DESCRIPTION = #{description,jdbcType=VARCHAR},
		VALID = #{valid,jdbcType=BIT},
		CITY = #{city,jdbcType=INTEGER},
		PREFIX = #{prefix,jdbcType=VARCHAR},
		HAS_MMT = #{hasMmt,jdbcType=BIT},
		REQUIRED_SITES=#{requiredSites,jdbcType=INTEGER},
		CREATOR = #{creator,jdbcType=INTEGER},
		CREATE_TIME = #{createTime,jdbcType=TIMESTAMP}
		where ID = #{id,jdbcType=INTEGER}
	</update>
	<select id="selectByUuid" parameterType="java.lang.String"
		resultMap="orgnizationDetail">
		<include refid="selectSql" />
		where a.UUID = #{uuid, jdbcType=VARCHAR}
	</select>
	<select id="selectIdByUuid" parameterType="java.lang.String"
		resultType="java.lang.Long">
		select ID from t4_org where UUID = #{uuid, jdbcType=VARCHAR}
	</select>
</mapper>