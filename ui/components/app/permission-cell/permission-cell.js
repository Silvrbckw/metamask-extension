import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Box from '../../ui/box';
import {
  AlignItems,
  Color,
  IconColor,
  JustifyContent,
  Size,
  TextColor,
  TextVariant,
} from '../../../helpers/constants/design-system';
import { AvatarIcon, Text } from '../../component-library';
import {
  Icon,
  ICON_NAMES,
  ICON_SIZES,
} from '../../component-library/icon/deprecated';
import { formatDate } from '../../../helpers/utils/util';
import { useI18nContext } from '../../../hooks/useI18nContext';
import Tooltip from '../../ui/tooltip';

const PermissionCell = ({
  title,
  description,
  weight,
  avatarIcon,
  dateApproved,
  revoked,
}) => {
  const t = useI18nContext();

  let infoIconColor = IconColor.iconMuted;
  let infoIcon = ICON_NAMES.INFO;
  let iconColor = Color.primaryDefault;
  let iconBackgroundColor = Color.primaryMuted;

  if (!revoked && weight === 1) {
    iconColor = Color.warningDefault;
    iconBackgroundColor = Color.warningMuted;
    infoIconColor = IconColor.warningDefault;
    infoIcon = ICON_NAMES.DANGER;
  }

  if (dateApproved) {
    iconColor = Color.iconMuted;
    iconBackgroundColor = Color.backgroundAlternative;
  }

  if (revoked) {
    iconColor = Color.iconMuted;
    iconBackgroundColor = Color.backgroundAlternative;
  }

  let permissionIcon = avatarIcon;
  if (typeof avatarIcon !== 'string' && avatarIcon?.props?.iconName) {
    permissionIcon = avatarIcon.props.iconName;
  }

  return (
    <Box
      className="permission-cell"
      justifyContent={JustifyContent.center}
      alignItems={AlignItems.flexStart}
      marginLeft={4}
      marginRight={4}
      paddingTop={2}
      paddingBottom={2}
    >
      <Box>
        {typeof permissionIcon === 'string' ? (
          <AvatarIcon
            iconName={permissionIcon}
            size={ICON_SIZES.MD}
            iconProps={{
              size: ICON_SIZES.SM,
            }}
            color={iconColor}
            backgroundColor={iconBackgroundColor}
          />
        ) : (
          permissionIcon
        )}
      </Box>
      <Box width="full" marginLeft={4} marginRight={4}>
        <Text
          size={Size.MD}
          variant={TextVariant.bodyMd}
          className={classnames('permission-cell__title', {
            'permission-cell__title-revoked': revoked,
          })}
        >
          {title}
        </Text>
        <Text
          size={Size.XS}
          className="permission-cell__status"
          variant={TextVariant.bodyXs}
          color={TextColor.textAlternative}
        >
          {!revoked &&
            (dateApproved
              ? t('approvedOn', [formatDate(dateApproved, 'yyyy-MM-dd')])
              : t('permissionRequested'))}
          {revoked ? t('permissionRevoked') : ''}
        </Text>
      </Box>
      <Box>
        <Tooltip html={<div>{description}</div>} position="bottom">
          <Icon color={infoIconColor} name={infoIcon} size={ICON_SIZES.SM} />
        </Tooltip>
      </Box>
    </Box>
  );
};

PermissionCell.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.object.isRequired,
  ]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  weight: PropTypes.number,
  avatarIcon: PropTypes.any.isRequired,
  dateApproved: PropTypes.number,
  revoked: PropTypes.bool,
};

export default PermissionCell;
