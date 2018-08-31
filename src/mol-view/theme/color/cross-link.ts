/**
 * Copyright (c) 2018 mol* contributors, licensed under MIT, See LICENSE file for more info.
 *
 * @author Alexander Rose <alexander.rose@weirdbyte.de>
 */

import { Link } from 'mol-model/structure';

import { Color, ColorScale, ColorBrewer } from 'mol-util/color';
import { Location } from 'mol-model/location';
import { ColorThemeProps, ColorTheme, LocationColor } from '../color';
import { Vec3 } from 'mol-math/linear-algebra';

const DefaultColor = Color(0xCCCCCC)

const distVecA = Vec3.zero(), distVecB = Vec3.zero()
function linkDistance(link: Link.Location) {
    link.aUnit.conformation.position(link.aIndex, distVecA)
    link.bUnit.conformation.position(link.bIndex, distVecB)
    return Vec3.distance(distVecA, distVecB)
}

export function CrossLinkColorTheme(props: ColorThemeProps): ColorTheme {
    let color: LocationColor

    if (props.structure) {
        const crosslinks = props.structure.crossLinkRestraints
        const scale = ColorScale.create({ domain: [ -10, 10 ], colors: ColorBrewer.RdYlBu })

        color = (location: Location): Color => {
            if (Link.isLocation(location)) {
                const pairs = crosslinks.getPairs(location.aIndex, location.aUnit, location.bIndex, location.bUnit)
                if (pairs) {
                    return scale.color(linkDistance(location) - pairs[0].distanceThreshold)
                }
            }
            return DefaultColor
        }
    } else {
        color = () => DefaultColor
    }

    return { kind: 'group', color }
}